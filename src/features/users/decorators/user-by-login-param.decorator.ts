import { UserByLoginPipe } from '../pipes/user-by-login.pipe';
import { Login } from 'src/auth/decorators/login.decorator';

export const UserByLoginParam = () => Login(UserByLoginPipe);
