/**
 * A label which contains mini user avatar and user name.
 * You may would like to use UserAvatar sometimes.
 */
 import React from "react";
 import { Label } from "semantic-ui-react";
 import User from "../../../models/User";
 interface Props {
     user: User;
 }
 export default function UserLabel(props: Props) {
     if (props.user) {
         const labelColor: any = "teal";
         return <Label image color={labelColor}>
                 <img src={"/images/avatar.png"}
                     alt="avatar" />
             {props.user.email}
         </Label>;
     } else {
         return <label />;
     }
 }