#ifndef RANWEN_C_H_GENERATED_
#define RANWEN_C_H_GENERATED_
#ifdef __cplusplus
extern "C" {
#endif

#include <stdint.h>

#include "wasm-rt.h"

#ifndef WASM_RT_MODULE_PREFIX
#define WASM_RT_MODULE_PREFIX
#endif

#define WASM_RT_PASTE_(x, y) x ## y
#define WASM_RT_PASTE(x, y) WASM_RT_PASTE_(x, y)
#define WASM_RT_ADD_PREFIX(x) WASM_RT_PASTE(WASM_RT_MODULE_PREFIX, x)

/* TODO(binji): only use stdint.h types in header */
typedef uint8_t u8;
typedef int8_t s8;
typedef uint16_t u16;
typedef int16_t s16;
typedef uint32_t u32;
typedef int32_t s32;
typedef uint64_t u64;
typedef int64_t s64;
typedef float f32;
typedef double f64;

extern void WASM_RT_ADD_PREFIX(init)(void);

/* import: 'env' 'memory' */
extern wasm_rt_memory_t (*Z_envZ_memory);
/* import: 'env' '_val1' */
extern u32 (*Z_envZ__val1Z_i);
/* import: 'env' '_val2' */
extern u32 (*Z_envZ__val2Z_i);
/* import: 'env' '_val3' */
extern u32 (*Z_envZ__val3Z_i);
/* import: 'env' '_val4' */
extern u32 (*Z_envZ__val4Z_i);
/* import: 'env' '_val5' */
extern u32 (*Z_envZ__val5Z_i);
/* import: 'env' '_val6' */
extern u32 (*Z_envZ__val6Z_i);

/* export: '_main' */
extern u32 (*WASM_RT_ADD_PREFIX(Z__mainZ_iv))(void);
#ifdef __cplusplus
}
#endif

#endif  /* RANWEN_C_H_GENERATED_ */
