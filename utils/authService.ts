import type { User } from '../types';

const MOCK_DB_USERS_KEY = 'mock_db_users';
const CURRENT_USER_KEY = 'current_user_session';
const DEFAULT_AVATAR = 'https://docs.bccsw.cn/logo.png';

type StoredUser = User & { passwordHash: string };

const getUsers = (): Record<string, StoredUser> => {
    try {
        const users = localStorage.getItem(MOCK_DB_USERS_KEY);
        return users ? JSON.parse(users) : {};
    } catch (e) {
        return {};
    }
};

const saveUsers = (users: Record<string, StoredUser>): void => {
    localStorage.setItem(MOCK_DB_USERS_KEY, JSON.stringify(users));
};

export const registerUser = async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            if (users[email]) {
                return reject(new Error('该邮箱地址已被注册。'));
            }

            const newUser: StoredUser = {
                id: `user_${Date.now()}`,
                email,
                passwordHash: password,
                avatar: DEFAULT_AVATAR,
                nickname: '',
            };

            users[email] = newUser;
            saveUsers(users);

            const userForSession: User = { id: newUser.id, email: newUser.email, avatar: newUser.avatar, nickname: newUser.nickname };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userForSession));
            resolve(userForSession);
        }, 500);
    });
};

export const loginUser = async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            const userRecord = users[email];

            if (!userRecord || userRecord.passwordHash !== password) {
                return reject(new Error('邮箱或密码不正确。'));
            }

            const userForSession: User = {
                id: userRecord.id,
                email: userRecord.email,
                avatar: userRecord.avatar,
                nickname: userRecord.nickname,
            };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userForSession));
            resolve(userForSession);
        }, 500);
    });
};

export const logoutUser = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
    try {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
};

export const updateUserProfile = async (email: string, profileData: Partial<Pick<User, 'avatar' | 'nickname'>>): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            const userRecord = users[email];

            if (!userRecord) {
                return reject(new Error('用户不存在。'));
            }

            const updatedUser = { ...userRecord, ...profileData };
            users[email] = updatedUser;
            saveUsers(users);

            const userForSession: User = {
                id: updatedUser.id,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                nickname: updatedUser.nickname,
            };

            // Also update current session
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.email === email) {
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userForSession));
            }
            
            resolve(userForSession);
        }, 300);
    });
};
