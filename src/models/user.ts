import { Schema, model } from 'mongoose';

export interface User {
    username: string;
    password: string;
    isActive: boolean;
    avatar: string;
}

const UsersSchema = new Schema<User>(
    {
        username: {
            type: String,
            required: [true, 'username is required'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'password is required']
        },
        isActive: {
            type: Boolean,
            default: true
        },
        avatar: {
            type: String,
            default: ''
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

const UsersModel = model<User>('User', UsersSchema);

export default UsersModel;
