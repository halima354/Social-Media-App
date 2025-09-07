import { roleTypes } from "../../../DB/model/User.model.js";

export const endPoint={
    createPost: [roleTypes.user],
    freeze:[roleTypes.user, roleTypes.admin],
    likePost:[roleTypes.user ],
    undoPost: [roleTypes.user],
    archivePost: [roleTypes.user],
}