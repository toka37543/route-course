import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db.js";

function checkNameLength(name) {
    if (!name || name.trim().length <= 2) {
        throw new Error("Name must be more than 2 characters", { cause: 400 });
    }
}

export const UserModel = sequelize.define(
    "user",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: { msg: "Invalid email format" },
            },
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                checkPasswordLength(value) {
                    if (value.length <= 6) {
                        throw new Error("Password must be more than 6 characters");
                    }
                },
            },
        },
        role: {
            type: DataTypes.ENUM("user", "admin"),
            defaultValue: "user",
            validate: {
                isIn: {
                    args: [["user", "admin"]],
                    msg: "Role must be user or admin",
                },
            },
        },
    },
    {
        timestamps: true,
        hooks: {
            beforeCreate: (user) => {
                checkNameLength(user.name);
            },
        },
    }
);

export class PostModel extends Model {}

PostModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: UserModel,
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: "post",
        timestamps: true,
        paranoid: true,
    }
);

export class CommentModel extends Model {}

CommentModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: PostModel,
                key: "id",
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: UserModel,
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: "comment",
        timestamps: true,
    }
);

UserModel.hasMany(PostModel, { foreignKey: "userId", onDelete: "CASCADE" });
PostModel.belongsTo(UserModel, { foreignKey: "userId" });

PostModel.hasMany(CommentModel, { foreignKey: "postId", onDelete: "CASCADE" });
CommentModel.belongsTo(PostModel, { foreignKey: "postId" });

UserModel.hasMany(CommentModel, { foreignKey: "userId", onDelete: "CASCADE" });
CommentModel.belongsTo(UserModel, { foreignKey: "userId" });
