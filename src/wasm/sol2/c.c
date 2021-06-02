#include <math.h>
#include <string.h>

#include "c.h"
#define UNLIKELY(x) __builtin_expect(!!(x), 0)
#define LIKELY(x) __builtin_expect(!!(x), 1)

#define TRAP(x) (wasm_rt_trap(WASM_RT_TRAP_##x), 0)

#define FUNC_PROLOGUE                                            \
  if (++wasm_rt_call_stack_depth > WASM_RT_MAX_CALL_STACK_DEPTH) \
    TRAP(EXHAUSTION)

#define FUNC_EPILOGUE --wasm_rt_call_stack_depth

#define UNREACHABLE TRAP(UNREACHABLE)

#define CALL_INDIRECT(table, t, ft, x, ...)          \
  (LIKELY((x) < table.size && table.data[x].func &&  \
          table.data[x].func_type == func_types[ft]) \
       ? ((t)table.data[x].func)(__VA_ARGS__)        \
       : TRAP(CALL_INDIRECT))

#define MEMCHECK(mem, a, t)  \
  if (UNLIKELY((a) + sizeof(t) > mem->size)) TRAP(OOB)

#define DEFINE_LOAD(name, t1, t2, t3)              \
  static inline t3 name(wasm_rt_memory_t* mem, u64 addr) {   \
    MEMCHECK(mem, addr, t1);                       \
    t1 result;                                     \
    memcpy(&result, &mem->data[addr], sizeof(t1)); \
    return (t3)(t2)result;                         \
  }

#define DEFINE_STORE(name, t1, t2)                           \
  static inline void name(wasm_rt_memory_t* mem, u64 addr, t2 value) { \
    MEMCHECK(mem, addr, t1);                                 \
    t1 wrapped = (t1)value;                                  \
    memcpy(&mem->data[addr], &wrapped, sizeof(t1));          \
  }

DEFINE_LOAD(i32_load, u32, u32, u32);
DEFINE_LOAD(i64_load, u64, u64, u64);
DEFINE_LOAD(f32_load, f32, f32, f32);
DEFINE_LOAD(f64_load, f64, f64, f64);
DEFINE_LOAD(i32_load8_s, s8, s32, u32);
DEFINE_LOAD(i64_load8_s, s8, s64, u64);
DEFINE_LOAD(i32_load8_u, u8, u32, u32);
DEFINE_LOAD(i64_load8_u, u8, u64, u64);
DEFINE_LOAD(i32_load16_s, s16, s32, u32);
DEFINE_LOAD(i64_load16_s, s16, s64, u64);
DEFINE_LOAD(i32_load16_u, u16, u32, u32);
DEFINE_LOAD(i64_load16_u, u16, u64, u64);
DEFINE_LOAD(i64_load32_s, s32, s64, u64);
DEFINE_LOAD(i64_load32_u, u32, u64, u64);
DEFINE_STORE(i32_store, u32, u32);
DEFINE_STORE(i64_store, u64, u64);
DEFINE_STORE(f32_store, f32, f32);
DEFINE_STORE(f64_store, f64, f64);
DEFINE_STORE(i32_store8, u8, u32);
DEFINE_STORE(i32_store16, u16, u32);
DEFINE_STORE(i64_store8, u8, u64);
DEFINE_STORE(i64_store16, u16, u64);
DEFINE_STORE(i64_store32, u32, u64);

#define I32_CLZ(x) ((x) ? __builtin_clz(x) : 32)
#define I64_CLZ(x) ((x) ? __builtin_clzll(x) : 64)
#define I32_CTZ(x) ((x) ? __builtin_ctz(x) : 32)
#define I64_CTZ(x) ((x) ? __builtin_ctzll(x) : 64)
#define I32_POPCNT(x) (__builtin_popcount(x))
#define I64_POPCNT(x) (__builtin_popcountll(x))

#define DIV_S(ut, min, x, y)                                 \
   ((UNLIKELY((y) == 0)) ?                TRAP(DIV_BY_ZERO)  \
  : (UNLIKELY((x) == min && (y) == -1)) ? TRAP(INT_OVERFLOW) \
  : (ut)((x) / (y)))

#define REM_S(ut, min, x, y)                                \
   ((UNLIKELY((y) == 0)) ?                TRAP(DIV_BY_ZERO) \
  : (UNLIKELY((x) == min && (y) == -1)) ? 0                 \
  : (ut)((x) % (y)))

#define I32_DIV_S(x, y) DIV_S(u32, INT32_MIN, (s32)x, (s32)y)
#define I64_DIV_S(x, y) DIV_S(u64, INT64_MIN, (s64)x, (s64)y)
#define I32_REM_S(x, y) REM_S(u32, INT32_MIN, (s32)x, (s32)y)
#define I64_REM_S(x, y) REM_S(u64, INT64_MIN, (s64)x, (s64)y)

#define DIVREM_U(op, x, y) \
  ((UNLIKELY((y) == 0)) ? TRAP(DIV_BY_ZERO) : ((x) op (y)))

#define DIV_U(x, y) DIVREM_U(/, x, y)
#define REM_U(x, y) DIVREM_U(%, x, y)

#define ROTL(x, y, mask) \
  (((x) << ((y) & (mask))) | ((x) >> (((mask) - (y) + 1) & (mask))))
#define ROTR(x, y, mask) \
  (((x) >> ((y) & (mask))) | ((x) << (((mask) - (y) + 1) & (mask))))

#define I32_ROTL(x, y) ROTL(x, y, 31)
#define I64_ROTL(x, y) ROTL(x, y, 63)
#define I32_ROTR(x, y) ROTR(x, y, 31)
#define I64_ROTR(x, y) ROTR(x, y, 63)

#define FMIN(x, y)                                          \
   ((UNLIKELY((x) != (x))) ? NAN                            \
  : (UNLIKELY((y) != (y))) ? NAN                            \
  : (UNLIKELY((x) == 0 && (y) == 0)) ? (signbit(x) ? x : y) \
  : (x < y) ? x : y)

#define FMAX(x, y)                                          \
   ((UNLIKELY((x) != (x))) ? NAN                            \
  : (UNLIKELY((y) != (y))) ? NAN                            \
  : (UNLIKELY((x) == 0 && (y) == 0)) ? (signbit(x) ? y : x) \
  : (x > y) ? x : y)

#define TRUNC_S(ut, st, ft, min, max, maxop, x)                             \
   ((UNLIKELY((x) != (x))) ? TRAP(INVALID_CONVERSION)                       \
  : (UNLIKELY((x) < (ft)(min) || (x) maxop (ft)(max))) ? TRAP(INT_OVERFLOW) \
  : (ut)(st)(x))

#define I32_TRUNC_S_F32(x) TRUNC_S(u32, s32, f32, INT32_MIN, INT32_MAX, >=, x)
#define I64_TRUNC_S_F32(x) TRUNC_S(u64, s64, f32, INT64_MIN, INT64_MAX, >=, x)
#define I32_TRUNC_S_F64(x) TRUNC_S(u32, s32, f64, INT32_MIN, INT32_MAX, >,  x)
#define I64_TRUNC_S_F64(x) TRUNC_S(u64, s64, f64, INT64_MIN, INT64_MAX, >=, x)

#define TRUNC_U(ut, ft, max, maxop, x)                                    \
   ((UNLIKELY((x) != (x))) ? TRAP(INVALID_CONVERSION)                     \
  : (UNLIKELY((x) <= (ft)-1 || (x) maxop (ft)(max))) ? TRAP(INT_OVERFLOW) \
  : (ut)(x))

#define I32_TRUNC_U_F32(x) TRUNC_U(u32, f32, UINT32_MAX, >=, x)
#define I64_TRUNC_U_F32(x) TRUNC_U(u64, f32, UINT64_MAX, >=, x)
#define I32_TRUNC_U_F64(x) TRUNC_U(u32, f64, UINT32_MAX, >,  x)
#define I64_TRUNC_U_F64(x) TRUNC_U(u64, f64, UINT64_MAX, >=, x)

#define DEFINE_REINTERPRET(name, t1, t2)  \
  static inline t2 name(t1 x) {           \
    t2 result;                            \
    memcpy(&result, &x, sizeof(result));  \
    return result;                        \
  }

DEFINE_REINTERPRET(f32_reinterpret_i32, u32, f32)
DEFINE_REINTERPRET(i32_reinterpret_f32, f32, u32)
DEFINE_REINTERPRET(f64_reinterpret_i64, u64, f64)
DEFINE_REINTERPRET(i64_reinterpret_f64, f64, u64)


static u32 func_types[1];

static void init_func_types(void) {
  func_types[0] = wasm_rt_register_func_type(0, 1, WASM_RT_I32);
}

static u32 _main(void);

static void init_globals(void) {
}

static u32 _main(void) {
  u32 l0 = 0, l1 = 0, l2 = 0, l3 = 0, l4 = 0, l5 = 0, l6 = 0, l7 = 0, 
      l8 = 0, l9 = 0, l10 = 0, l11 = 0, l12 = 0, l13 = 0, l14 = 0, l15 = 0, 
      l16 = 0, l17 = 0, l18 = 0, l19 = 0, l20 = 0, l21 = 0, l22 = 0, l23 = 0, 
      l24 = 0, l25 = 0, l26 = 0, l27 = 0, l28 = 0, l29 = 0, l30 = 0, l31 = 0, 
      l32 = 0, l33 = 0, l34 = 0, l35 = 0, l36 = 0, l37 = 0, l38 = 0, l39 = 0, 
      l40 = 0, l41 = 0, l42 = 0, l43 = 0, l44 = 0, l45 = 0, l46 = 0, l47 = 0, 
      l48 = 0, l49 = 0, l50 = 0, l51 = 0, l52 = 0, l53 = 0, l54 = 0, l55 = 0, 
      l56 = 0, l57 = 0, l58 = 0, l59 = 0, l60 = 0, l61 = 0, l62 = 0, l63 = 0, 
      l64 = 0, l65 = 0, l66 = 0, l67 = 0, l68 = 0, l69 = 0, l70 = 0, l71 = 0, 
      l72 = 0, l73 = 0, l74 = 0, l75 = 0, l76 = 0, l77 = 0, l78 = 0, l79 = 0, 
      l80 = 0, l81 = 0, l82 = 0, l83 = 0, l84 = 0, l85 = 0, l86 = 0, l87 = 0, 
      l88 = 0, l89 = 0, l90 = 0, l91 = 0, l92 = 0, l93 = 0, l94 = 0, l95 = 0, 
      l96 = 0, l97 = 0, l98 = 0, l99 = 0, l100 = 0, l101 = 0, l102 = 0, l103 = 0, 
      l104 = 0, l105 = 0, l106 = 0, l107 = 0, l108 = 0, l109 = 0, l110 = 0, l111 = 0, 
      l112 = 0, l113 = 0, l114 = 0, l115 = 0, l116 = 0;
  FUNC_PROLOGUE;
  u32 i0, i1, i2;
  i0 = (*Z_envZ__val1Z_i);
  l116 = i0;
  i0 = (*Z_envZ__val1Z_i);
  i1 = 16u;
  i0 += i1;
  (*Z_envZ__val1Z_i) = i0;
  i0 = (*Z_envZ__val1Z_i);
  i1 = (*Z_envZ__val2Z_i);
  i0 = (u32)((s32)i0 >= (s32)i1);
  if (i0) {
  }
  i0 = 0u;
  l114 = i0;
  i0 = 0u;
  l113 = i0;
  i0 = 0u;
  l111 = i0;
  i0 = 0u;
  l0 = i0;
  i0 = 114514u;
  l111 = i0;
  i0 = 3776u;
  i1 = 0u;
  i32_store(Z_envZ_memory, (u64)(i0), i1);
  L1: 
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l1 = i0;
    i0 = l1;
    i1 = 96u;
    i0 = (u32)((s32)i0 < (s32)i1);
    l23 = i0;
    i0 = l23;
    i0 = !(i0);
    if (i0) {
      goto B2;
    }
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l34 = i0;
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l45 = i0;
    i0 = 1952u;
    i1 = l45;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l56 = i0;
    i0 = l56;
    i1 = l34;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l67 = i0;
    i0 = l67;
    i1 = 1u;
    i0 += i1;
    l78 = i0;
    i0 = 3776u;
    i1 = l78;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    goto L1;
    B2:;
  i0 = 3776u;
  i1 = 1u;
  i32_store(Z_envZ_memory, (u64)(i0), i1);
  L4: 
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l89 = i0;
    i0 = l89;
    i1 = 96u;
    i0 = (u32)((s32)i0 < (s32)i1);
    l100 = i0;
    i0 = l100;
    i0 = !(i0);
    if (i0) {
      goto B5;
    }
    i0 = l111;
    l2 = i0;
    i0 = l2;
    i1 = 1919u;
    i0 *= i1;
    l13 = i0;
    i0 = l13;
    i1 = 7u;
    i0 += i1;
    l15 = i0;
    i0 = l15;
    i1 = 334363u;
    i0 = I32_REM_S(i0, i1);
    i1 = 4294967295u;
    i0 &= i1;
    l16 = i0;
    i0 = l16;
    l111 = i0;
    i0 = l111;
    l17 = i0;
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l18 = i0;
    i0 = l17;
    i1 = l18;
    i0 = I32_REM_S(i0, i1);
    i1 = 4294967295u;
    i0 &= i1;
    l19 = i0;
    i0 = l19;
    l113 = i0;
    i0 = l113;
    l20 = i0;
    i0 = 1952u;
    i1 = l20;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l21 = i0;
    i0 = l21;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l22 = i0;
    i0 = l22;
    l114 = i0;
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l24 = i0;
    i0 = 1952u;
    i1 = l24;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l25 = i0;
    i0 = l25;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l26 = i0;
    i0 = l113;
    l27 = i0;
    i0 = 1952u;
    i1 = l27;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l28 = i0;
    i0 = l28;
    i1 = l26;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    i0 = l114;
    l29 = i0;
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l30 = i0;
    i0 = 1952u;
    i1 = l30;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l31 = i0;
    i0 = l31;
    i1 = l29;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l32 = i0;
    i0 = l32;
    i1 = 1u;
    i0 += i1;
    l33 = i0;
    i0 = 3776u;
    i1 = l33;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    goto L4;
    B5:;
  i0 = 3776u;
  i1 = 0u;
  i32_store(Z_envZ_memory, (u64)(i0), i1);
  L7: 
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l35 = i0;
    i0 = (*Z_envZ__val3Z_i);
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l36 = i0;
    i0 = l35;
    i1 = l36;
    i0 = (u32)((s32)i0 < (s32)i1);
    l37 = i0;
    i0 = l37;
    i0 = !(i0);
    if (i0) {
      goto B8;
    }
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l38 = i0;
    i0 = (*Z_envZ__val6Z_i);
    i1 = l38;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l39 = i0;
    i0 = l39;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l40 = i0;
    i0 = l40;
    i1 = 32u;
    i0 -= i1;
    l41 = i0;
    i0 = l41;
    l113 = i0;
    i0 = l113;
    l42 = i0;
    i0 = l42;
    i1 = 0u;
    i0 = (u32)((s32)i0 < (s32)i1);
    l43 = i0;
    i0 = l113;
    l44 = i0;
    i0 = l44;
    i1 = 96u;
    i0 = (u32)((s32)i0 >= (s32)i1);
    l46 = i0;
    i0 = l43;
    i1 = l46;
    i0 |= i1;
    l112 = i0;
    i0 = l112;
    if (i0) {
      i0 = 10u;
      l115 = i0;
      goto B8;
    }
    i0 = l113;
    l47 = i0;
    i0 = 1952u;
    i1 = l47;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l48 = i0;
    i0 = l48;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l49 = i0;
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l50 = i0;
    i0 = l49;
    i1 = l50;
    i0 += i1;
    l51 = i0;
    i0 = l51;
    i1 = 96u;
    i0 = I32_REM_S(i0, i1);
    i1 = 4294967295u;
    i0 &= i1;
    l52 = i0;
    i0 = l52;
    i1 = 32u;
    i0 += i1;
    l53 = i0;
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l54 = i0;
    i0 = 1152u;
    i1 = l54;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l55 = i0;
    i0 = l55;
    i1 = l53;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l57 = i0;
    i0 = l57;
    i1 = 1u;
    i0 += i1;
    l58 = i0;
    i0 = 3776u;
    i1 = l58;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    goto L7;
    B8:;
  i0 = l115;
  i1 = 10u;
  i0 = i0 == i1;
  if (i0) {
    i0 = 4294967295u;
    l0 = i0;
    i0 = l0;
    l14 = i0;
    i0 = l116;
    (*Z_envZ__val1Z_i) = i0;
    i0 = l14;
    goto Bfunc;
  }
  i0 = 3776u;
  i1 = 0u;
  i32_store(Z_envZ_memory, (u64)(i0), i1);
  L12: 
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l59 = i0;
    i0 = (*Z_envZ__val3Z_i);
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l60 = i0;
    i0 = l59;
    i1 = l60;
    i0 = (u32)((s32)i0 < (s32)i1);
    l61 = i0;
    i0 = l61;
    i0 = !(i0);
    if (i0) {
      goto B13;
    }
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l62 = i0;
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l63 = i0;
    i0 = 2336u;
    i1 = l63;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l64 = i0;
    i0 = l64;
    i1 = l62;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l65 = i0;
    i0 = l65;
    i1 = 1u;
    i0 += i1;
    l66 = i0;
    i0 = 3776u;
    i1 = l66;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    goto L12;
    B13:;
  i0 = 3776u;
  i1 = 1u;
  i32_store(Z_envZ_memory, (u64)(i0), i1);
  L15: 
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l68 = i0;
    i0 = (*Z_envZ__val3Z_i);
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l69 = i0;
    i0 = l68;
    i1 = l69;
    i0 = (u32)((s32)i0 < (s32)i1);
    l70 = i0;
    i0 = l70;
    i0 = !(i0);
    if (i0) {
      goto B16;
    }
    i0 = l111;
    l71 = i0;
    i0 = l71;
    i1 = 1919u;
    i0 *= i1;
    l72 = i0;
    i0 = l72;
    i1 = 7u;
    i0 += i1;
    l73 = i0;
    i0 = l73;
    i1 = 334363u;
    i0 = I32_REM_S(i0, i1);
    i1 = 4294967295u;
    i0 &= i1;
    l74 = i0;
    i0 = l74;
    l111 = i0;
    i0 = l111;
    l75 = i0;
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l76 = i0;
    i0 = l75;
    i1 = l76;
    i0 = I32_REM_S(i0, i1);
    i1 = 4294967295u;
    i0 &= i1;
    l77 = i0;
    i0 = l77;
    l113 = i0;
    i0 = l113;
    l79 = i0;
    i0 = 2336u;
    i1 = l79;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l80 = i0;
    i0 = l80;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l81 = i0;
    i0 = l81;
    l114 = i0;
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l82 = i0;
    i0 = 2336u;
    i1 = l82;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l83 = i0;
    i0 = l83;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l84 = i0;
    i0 = l113;
    l85 = i0;
    i0 = 2336u;
    i1 = l85;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l86 = i0;
    i0 = l86;
    i1 = l84;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    i0 = l114;
    l87 = i0;
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l88 = i0;
    i0 = 2336u;
    i1 = l88;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l90 = i0;
    i0 = l90;
    i1 = l87;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l91 = i0;
    i0 = l91;
    i1 = 1u;
    i0 += i1;
    l92 = i0;
    i0 = 3776u;
    i1 = l92;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    goto L15;
    B16:;
  i0 = 3776u;
  i1 = 0u;
  i32_store(Z_envZ_memory, (u64)(i0), i1);
  L18: 
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l93 = i0;
    i0 = (*Z_envZ__val3Z_i);
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l94 = i0;
    i0 = l93;
    i1 = l94;
    i0 = (u32)((s32)i0 < (s32)i1);
    l95 = i0;
    i0 = l95;
    i0 = !(i0);
    if (i0) {
      goto B19;
    }
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l96 = i0;
    i0 = 1152u;
    i1 = l96;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l97 = i0;
    i0 = l97;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l98 = i0;
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l99 = i0;
    i0 = 2336u;
    i1 = l99;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l101 = i0;
    i0 = l101;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l102 = i0;
    i0 = 1552u;
    i1 = l102;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l103 = i0;
    i0 = l103;
    i1 = l98;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l104 = i0;
    i0 = l104;
    i1 = 1u;
    i0 += i1;
    l105 = i0;
    i0 = 3776u;
    i1 = l105;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    goto L18;
    B19:;
  i0 = (*Z_envZ__val3Z_i);
  i0 = i32_load(Z_envZ_memory, (u64)(i0));
  l106 = i0;
  i0 = (*Z_envZ__val5Z_i);
  i0 = i32_load(Z_envZ_memory, (u64)(i0));
  l107 = i0;
  i0 = l106;
  i1 = l107;
  i0 = i0 != i1;
  l108 = i0;
  i0 = l108;
  if (i0) {
    i0 = 0u;
    l0 = i0;
    i0 = l0;
    l14 = i0;
    i0 = l116;
    (*Z_envZ__val1Z_i) = i0;
    i0 = l14;
    goto Bfunc;
  }
  i0 = 3776u;
  i1 = 0u;
  i32_store(Z_envZ_memory, (u64)(i0), i1);
  L22: 
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l109 = i0;
    i0 = (*Z_envZ__val3Z_i);
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l110 = i0;
    i0 = l109;
    i1 = l110;
    i0 = (u32)((s32)i0 < (s32)i1);
    l3 = i0;
    i0 = l3;
    i0 = !(i0);
    if (i0) {
      i0 = 28u;
      l115 = i0;
      goto B23;
    }
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l4 = i0;
    i0 = 1552u;
    i1 = l4;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l5 = i0;
    i0 = l5;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l6 = i0;
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l7 = i0;
    i0 = (*Z_envZ__val4Z_i);
    i1 = l7;
    i2 = 2u;
    i1 <<= (i2 & 31);
    i0 += i1;
    l8 = i0;
    i0 = l8;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l9 = i0;
    i0 = l6;
    i1 = l9;
    i0 = i0 != i1;
    l10 = i0;
    i0 = l10;
    if (i0) {
      i0 = 26u;
      l115 = i0;
      goto B23;
    }
    i0 = 3776u;
    i0 = i32_load(Z_envZ_memory, (u64)(i0));
    l11 = i0;
    i0 = l11;
    i1 = 1u;
    i0 += i1;
    l12 = i0;
    i0 = 3776u;
    i1 = l12;
    i32_store(Z_envZ_memory, (u64)(i0), i1);
    goto L22;
    B23:;
  i0 = l115;
  i1 = 26u;
  i0 = i0 == i1;
  if (i0) {
    i0 = 0u;
    l0 = i0;
    i0 = l0;
    l14 = i0;
    i0 = l116;
    (*Z_envZ__val1Z_i) = i0;
    i0 = l14;
    goto Bfunc;
  } else {
    i0 = l115;
    i1 = 28u;
    i0 = i0 == i1;
    if (i0) {
      i0 = 1u;
      l0 = i0;
      i0 = l0;
      l14 = i0;
      i0 = l116;
      (*Z_envZ__val1Z_i) = i0;
      i0 = l14;
      goto Bfunc;
    }
  }
  i0 = 0u;
  goto Bfunc;
  Bfunc:;
  FUNC_EPILOGUE;
  return i0;
}


static void init_memory(void) {
}

static void init_table(void) {
  uint32_t offset;
}

/* export: '_main' */
u32 (*WASM_RT_ADD_PREFIX(Z__mainZ_iv))(void);

static void init_exports(void) {
  /* export: '_main' */
  WASM_RT_ADD_PREFIX(Z__mainZ_iv) = (&_main);
}

void WASM_RT_ADD_PREFIX(init)(void) {
  init_func_types();
  init_globals();
  init_memory();
  init_table();
  init_exports();
}
