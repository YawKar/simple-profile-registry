import { CurrentUserLogin } from 'src/auth/decorators/current-user-login.decorator';
import { UserByLoginPipe } from '../pipes/user-by-login.pipe';

export const UserByLoginParam = () => CurrentUserLogin(UserByLoginPipe);
