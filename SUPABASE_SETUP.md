# Supabase 관리자 설정

1. Supabase 프로젝트를 만들고 Auth에서 관리자 이메일 사용자를 직접 생성합니다.
2. `supabase/migrations/202605250001_admin_posts.sql`을 Supabase SQL editor 또는 migration workflow로 적용합니다.
3. `.env.local`에 값을 추가합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

4. 생성한 Auth 사용자의 UUID를 확인한 뒤 관리자 프로필을 등록합니다.

```sql
insert into public.admin_profiles (user_id, email, display_name, role)
values (
  'AUTH_USER_UUID',
  'admin@example.com',
  '둘레살롱 편집자',
  'admin'
);
```

5. 초기 예시 글이 필요하면 `supabase/seed.sql`을 적용합니다.
6. 앱을 재시작하고 `/admin/login`에서 로그인합니다.

배포 도메인은 `http://doulesalon.com`입니다. Supabase Dashboard의 Authentication URL Configuration에는 다음을 등록합니다.

```text
Site URL: http://doulesalon.com
Redirect URLs:
http://doulesalon.com/**
http://localhost:3000/**
http://127.0.0.1:3000/**
```

주의:
- `service_role` 또는 secret key를 `NEXT_PUBLIC_` 환경변수에 넣지 않습니다.
- 공개 회원가입은 사용하지 않습니다. 관리자 계정은 Supabase Dashboard에서 직접 만듭니다.
- 대표 이미지는 `post-assets` bucket에 저장됩니다.
