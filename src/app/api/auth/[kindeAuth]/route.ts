import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server';
import db from '@/lib/db';

export const GET = handleAuth();
