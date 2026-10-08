import { User } from '../adapters/models/User';

declare global {
  namespace Express {
    interface Request {
      user?: User; // We will define User model next
    }
  }
}
