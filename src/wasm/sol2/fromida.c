int __cdecl main(int argc, const char **argv, const char **envp)
{
  int v3; // ebx
  unsigned int *v4; // rdx
  __int64 v5; // rdi
  signed int v6; // ecx
  __int64 v7; // rax
  signed __int64 v8; // rdi
  signed int v9; // ecx
  __int64 v10; // rdx
  int v11; // ebp
  __int64 v12; // rcx
  int *v13; // rdx
  int v14; // er9
  unsigned __int64 v15; // rax
  __int64 v16; // rdx
  unsigned __int64 v17; // r8
  __int64 v18; // rdi
  int v19; // eax
  __int64 v20; // rdx
  int v21; // ecx
  __int64 v22; // rsi
  __int64 v23; // rdx
  unsigned int v24; // edx
  __int64 v25; // rdx
  int v26; // eax
  __int64 v27; // rdx
  int v28; // eax
  unsigned int *v29; // rax
  __int64 v30; // rdx
  __int64 v31; // rdi
  __int64 v32; // rax
  __int64 v33; // rcx
  int result; // eax
  unsigned __int64 v35; // rcx
  __int64 v36; // rdi
  int v37; // er8
  __int64 v38; // rax
  int v39; // edx
  __int64 v40; // rdx
  __int64 v41; // rax
  unsigned int v42; // er13
  unsigned __int64 v43; // rdx
  __int64 v44; // rdi
  int v45; // eax
  __int64 v46; // rcx
  int v47; // ecx
  int v48; // eax
  __int64 v49; // rcx
  __int64 v50; // rax
  __int64 v51; // rcx
  __int64 v52; // rax
  unsigned __int64 v53; // r8
  __int64 v54; // rdi
  int v55; // eax
  __int64 v56; // rdx
  __int64 v57; // rcx
  int v58; // ecx
  __int64 v59; // rdx

  if ( ++wasm_rt_call_stack_depth <= 0x1F4u )
  {
    v3 = *Z_envZ__val1Z_i;
    *Z_envZ__val1Z_i += 16;
    v4 = (unsigned int *)Z_envZ_memory;
    if ( *(_DWORD *)(Z_envZ_memory + 16LL) <= 0xEC3u )
      goto LABEL_22;
    *(_DWORD *)(*Z_envZ_memory + 3776LL) = 0;
    argv = (const char **)v4[4];
    v5 = *(_QWORD *)v4;
    if ( (unsigned int)argv <= 0xEC3 )
      goto LABEL_22;
    v6 = *(_DWORD *)(v5 + 3776);
    if ( v6 <= 95 )
    {
      while ( 1 )
      {
        v7 = (unsigned int)(4 * v6 + 1952);
        if ( v7 + 4 > (unsigned __int64)argv )
          break;
        *(_DWORD *)(v5 + v7) = v6;
        v4 = (unsigned int *)Z_envZ_memory;
        if ( *(_DWORD *)(Z_envZ_memory + 16LL) <= 0xEC3u )
          break;
        ++*(_DWORD *)(*Z_envZ_memory + 3776LL);
        argv = (const char **)v4[4];
        if ( (unsigned int)argv <= 0xEC3 )
          break;
        v5 = *(_QWORD *)v4;
        v6 = *(_DWORD *)(*(_QWORD *)v4 + 3776LL);
        if ( v6 > 95 )
          goto LABEL_9;
      }
      while ( 1 )
      {
LABEL_22:
        v8 = 1LL;
        wasm_rt_trap(1LL, argv);
LABEL_23:
        v11 = 114514;
LABEL_24:
        *(_DWORD *)(v8 + 3776) = 0;
        v17 = v4[4];
        v18 = *(_QWORD *)v4;
        argv = (const char **)v4[4];
        if ( (unsigned int)v17 > 0xEC3 )
        {
          v19 = *(_DWORD *)(v18 + 3776);
          v20 = (unsigned int)*Z_envZ__val3Z_i;
          if ( v20 + 4 <= v17 )
          {
            if ( *(_DWORD *)(v18 + v20) <= v19 )
            {
LABEL_35:
              i32_store_isra_1_constprop_2(v18, argv, 0LL);
              while ( 1 )
              {
                argv = (const char **)*(unsigned int *)(Z_envZ_memory + 16LL);
                if ( (unsigned int)argv <= 0xEC3 )
                  break;
                v31 = *Z_envZ_memory;
                v32 = (unsigned int)*Z_envZ__val3Z_i;
                v33 = *(unsigned int *)(*Z_envZ_memory + 3776LL);
                if ( v32 + 4 > (unsigned __int64)(unsigned int)argv )
                  break;
                if ( (signed int)v33 >= *(_DWORD *)(v31 + v32) )
                {
                  i32_store_isra_1_constprop_2(v31, argv, 1LL);
                  while ( 1 )
                  {
                    v35 = *(unsigned int *)(Z_envZ_memory + 16LL);
                    v36 = *Z_envZ_memory;
                    argv = (const char **)*(unsigned int *)(Z_envZ_memory + 16LL);
                    if ( (unsigned int)v35 <= 0xEC3 )
                      goto LABEL_22;
                    v37 = *(_DWORD *)(v36 + 3776);
                    v38 = (unsigned int)*Z_envZ__val3Z_i;
                    if ( v38 + 4 > v35 )
                      goto LABEL_22;
                    if ( v37 >= *(_DWORD *)(v36 + v38) )
                    {
                      i32_store_isra_1_constprop_2(v36, argv, 0LL);
                      while ( 1 )
                      {
                        v43 = *(unsigned int *)(Z_envZ_memory + 16LL);
                        v44 = *Z_envZ_memory;
                        argv = (const char **)*(unsigned int *)(Z_envZ_memory + 16LL);
                        if ( (unsigned int)v43 <= 0xEC3 )
                          goto LABEL_22;
                        v45 = *(_DWORD *)(v44 + 3776);
                        v46 = (unsigned int)*Z_envZ__val3Z_i;
                        if ( v46 + 4 > v43 )
                          goto LABEL_22;
                        v47 = *(_DWORD *)(v44 + v46);
                        if ( v45 >= v47 )
                        {
                          v52 = (unsigned int)*Z_envZ__val5Z_i;
                          if ( v43 < v52 + 4 )
                            goto LABEL_22;
                          if ( v47 != *(_DWORD *)(v44 + v52) )
                          {
LABEL_65:
                            *Z_envZ__val1Z_i = v3;
                            result = 0;
                            goto LABEL_44;
                          }
                          i32_store_isra_1_constprop_2(v44, argv, 0LL);
                          while ( 1 )
                          {
                            v53 = *(unsigned int *)(Z_envZ_memory + 16LL);
                            v54 = *Z_envZ_memory;
                            argv = (const char **)*(unsigned int *)(Z_envZ_memory + 16LL);
                            if ( (unsigned int)v53 <= 0xEC3 )
                              goto LABEL_22;
                            v55 = *(_DWORD *)(v54 + 3776);
                            v56 = (unsigned int)*Z_envZ__val3Z_i;
                            if ( v56 + 4 > v53 )
                              goto LABEL_22;
                            if ( v55 >= *(_DWORD *)(v54 + v56) )
                            {
                              *Z_envZ__val1Z_i = v3;
                              result = 1;
                              goto LABEL_44;
                            }
                            v57 = (unsigned int)(4 * v55 + 1552);
                            if ( v53 < v57 + 4 )
                              goto LABEL_22;
                            v58 = *(_DWORD *)(v54 + v57);
                            v59 = (unsigned int)(*Z_envZ__val4Z_i + 4 * v55);
                            if ( v53 < v59 + 4 )
                              goto LABEL_22;
                            if ( *(_DWORD *)(v54 + v59) != v58 )
                              goto LABEL_65;
                            i32_store_isra_1_constprop_2(v54, argv, (unsigned int)(v55 + 1));
                          }
                        }
                        v48 = 4 * v45;
                        v49 = (unsigned int)(v48 + 1152);
                        if ( v43 < v49 + 4 )
                          goto LABEL_22;
                        v50 = (unsigned int)(v48 + 2336);
                        v51 = *(unsigned int *)(v44 + v49);
                        if ( v43 < v50 + 4 )
                          goto LABEL_22;
                        i32_store_isra_1(v44, argv, (unsigned int)(4 * *(_DWORD *)(v44 + v50) + 1552), v51);
                        argv = (const char **)*(unsigned int *)(Z_envZ_memory + 16LL);
                        if ( (unsigned int)argv <= 0xEC3 )
                          goto LABEL_22;
                        i32_store_isra_1_constprop_2(
                          *Z_envZ_memory,
                          argv,
                          (unsigned int)(*(_DWORD *)(*Z_envZ_memory + 3776LL) + 1));
                      }
                    }
                    v39 = (1919 * v11 + 7) % 334363;
                    v11 = (1919 * v11 + 7) % 334363;
                    if ( !v37 )
                      goto LABEL_41;
                    v40 = (unsigned int)(4 * (v39 % v37) + 2336);
                    if ( v35 < v40 + 4 )
                      goto LABEL_22;
                    v41 = (unsigned int)(4 * v37 + 2336);
                    v42 = *(_DWORD *)(v36 + v40);
                    if ( v35 < v41 + 4 )
                      goto LABEL_22;
                    i32_store_isra_1(v36, argv, v40, *(unsigned int *)(v36 + v41));
                    argv = (const char **)*(unsigned int *)(Z_envZ_memory + 16LL);
                    if ( (unsigned int)argv <= 0xEC3 )
                      goto LABEL_22;
                    i32_store_isra_1(
                      *Z_envZ_memory,
                      argv,
                      (unsigned int)(4 * *(_DWORD *)(*Z_envZ_memory + 3776LL) + 2336),
                      v42);
                    argv = (const char **)*(unsigned int *)(Z_envZ_memory + 16LL);
                    if ( (unsigned int)argv <= 0xEC3 )
                      goto LABEL_22;
                    i32_store_isra_1_constprop_2(
                      *Z_envZ_memory,
                      argv,
                      (unsigned int)(*(_DWORD *)(*Z_envZ_memory + 3776LL) + 1));
                  }
                }
                i32_store_isra_1(v31, argv, (unsigned int)(4 * v33 + 2336), v33);
                argv = (const char **)*(unsigned int *)(Z_envZ_memory + 16LL);
                if ( (unsigned int)argv <= 0xEC3 )
                  goto LABEL_22;
                i32_store_isra_1_constprop_2(
                  *Z_envZ_memory,
                  argv,
                  (unsigned int)(*(_DWORD *)(*Z_envZ_memory + 3776LL) + 1));
              }
            }
            else
            {
              while ( 1 )
              {
                v21 = 4 * v19;
                v22 = (unsigned int)(*Z_envZ__val6Z_i + 4 * v19);
                v23 = v22;
                argv = (const char **)(v22 + 4);
                if ( (unsigned __int64)argv > v17 )
                  break;
                v24 = *(_DWORD *)(v18 + v23) - 32;
                if ( v24 > 0x5F )
                  goto LABEL_43;
                v25 = 4 * v24 + 1952;
                argv = (const char **)(v25 + 4);
                if ( v25 + 4 > v17 )
                  break;
                v26 = *(_DWORD *)(v18 + v25) + v19;
                v27 = (unsigned int)(v21 + 1152);
                argv = (const char **)(unsigned int)(v26 % 96);
                v28 = v26 % 96 + 32;
                if ( v17 < v27 + 4 )
                  break;
                *(_DWORD *)(v18 + v27) = v28;
                v29 = (unsigned int *)Z_envZ_memory;
                if ( *(_DWORD *)(Z_envZ_memory + 16LL) <= 0xEC3u )
                  break;
                ++*(_DWORD *)(*Z_envZ_memory + 3776LL);
                v17 = v29[4];
                argv = (const char **)v29[4];
                if ( (unsigned int)v17 <= 0xEC3 )
                  break;
                v18 = *(_QWORD *)v29;
                v30 = (unsigned int)*Z_envZ__val3Z_i;
                v19 = *(_DWORD *)(*(_QWORD *)v29 + 3776LL);
                if ( v30 + 4 > v17 )
                  break;
                if ( v19 >= *(_DWORD *)(v18 + v30) )
                  goto LABEL_35;
              }
            }
          }
        }
      }
    }
LABEL_9:
    *(_DWORD *)(v5 + 3776) = 1;
    argv = (const char **)v4[4];
    v8 = *(_QWORD *)v4;
    if ( (unsigned int)argv <= 0xEC3 )
      goto LABEL_22;
    v9 = *(_DWORD *)(v8 + 3776);
    if ( v9 > 95 )
      goto LABEL_23;
    if ( v9 )
    {
      v10 = (unsigned int)(4 * (75882 % v9) + 1952);
      if ( v10 + 4 <= (unsigned __int64)argv )
      {
        v11 = 75882;
        while ( 1 )
        {
          v12 = (unsigned int)(4 * v9 + 1952);
          v13 = (int *)(v8 + v10);
          v14 = *v13;
          if ( v12 + 4 > (unsigned __int64)argv )
            break;
          *v13 = *(_DWORD *)(v8 + v12);
          v15 = *(unsigned int *)(Z_envZ_memory + 16LL);
          if ( (unsigned int)v15 <= 0xEC3 )
            break;
          v16 = (unsigned int)(4 * *(_DWORD *)(*Z_envZ_memory + 3776LL) + 1952);
          argv = (const char **)(v16 + 4);
          if ( v16 + 4 > v15 )
            break;
          *(_DWORD *)(*Z_envZ_memory + v16) = v14;
          v4 = (unsigned int *)Z_envZ_memory;
          if ( *(_DWORD *)(Z_envZ_memory + 16LL) <= 0xEC3u )
            break;
          ++*(_DWORD *)(*Z_envZ_memory + 3776LL);
          argv = (const char **)v4[4];
          if ( (unsigned int)argv <= 0xEC3 )
            break;
          v8 = *(_QWORD *)v4;
          v9 = *(_DWORD *)(*(_QWORD *)v4 + 3776LL);
          if ( v9 > 95 )
            goto LABEL_24;
          v11 = (1919 * v11 + 7) % 334363;
          if ( !v9 )
            goto LABEL_41;
          v10 = (unsigned int)(4 * (v11 % v9) + 1952);
          if ( (unsigned __int64)argv < v10 + 4 )
            goto LABEL_22;
        }
      }
      goto LABEL_22;
    }
LABEL_41:
    wasm_rt_trap(3LL, argv);
  }
  wasm_rt_trap(7LL, argv);
LABEL_43:
  *Z_envZ__val1Z_i = v3;
  result = -1;
LABEL_44:
  --*((_DWORD *)&wasm_rt_call_stack_depth + 0x40000000);
  return result;
}
