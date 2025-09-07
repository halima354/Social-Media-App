import { roleTypes } from "../../../DB/model/User.model.js";

export const endPoint={
    create: [roleTypes.user],
    freeze:[roleTypes.user, roleTypes.admin],
    like:[roleTypes.user ]
}