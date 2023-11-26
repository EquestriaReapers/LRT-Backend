import { UserRole } from "src/constants";

export interface JwtPayload {
    email: string;
    role: UserRole
}
