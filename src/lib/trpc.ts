import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../rork-fashion-muse-studio-last/backend/trpc/app-router';

export const trpc = createTRPCReact<AppRouter>();

