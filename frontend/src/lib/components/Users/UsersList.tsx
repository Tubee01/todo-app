import { Avatar, Grid, Skeleton } from "@mui/material";
import { isUUID, stringAvatar } from "../../helpers";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ListAlt } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { useConfirmationModalContext } from "../../../context/ModalContext";
import { del } from "../../api";
import UserEdit, { IUser } from "./UserEdit";
import UserUpdate from "../../api/user/update";
import TodoList from "../Todos/TodoList";
import UserFindAll from "../../api/user/findAll";


const UsersList = () => {
    const [usersList, setUsersList] = useState<[] | IUser[]>([]);
    const [{ users, isUserFindAllLoading, isUserFindAllError }, setUserFindAllFormData, setIsUserFindAllLoading, setUserFindAllError] = UserFindAll();
    const [{ isUserUpdateError, isUserUpdateSuccess, isUserUpdateLoading }, setUserUpdateFormData, setIsUserUpdateLoading, setIsUserUpdateError] = UserUpdate();

    const conFirmDialog = useConfirmationModalContext();
    const value = useAuthContext();
    const auth = value?.auth;

    // delete user 
    const deleteUser = async (id: string) => {
        const response = await del(`user/${id}`);
        if (response.status === 1) {
            setUsersList(usersList.filter(user => user.id !== id));
            return alert("User deleted successfully");
        }
        return alert("User not deleted");

    }
    // save user
    const saveUser = async () => {
        setIsUserUpdateLoading(true);
    }
    // open Todos modal
    const openTodosDialog = async (user: IUser) => {
        if (!user || !isUUID(user.id as string)) {
            return
        }
        const result = await conFirmDialog.showConfirmation(
            'User Todos',
            <TodoList userId={user.id} />,
            false
        );
        result && console.log(result);
    }

    // open confirm dialog
    const openUserEditDialog = async (user: IUser) => {
        if (!user || !isUUID(user.id as string)) {
            return
        }
        setUserUpdateFormData(user);
        const result = await conFirmDialog.showConfirmation(
            'User Edit',
            <UserEdit user={user} handleChange={setUserUpdateFormData} />,
            'Save'
        );
        result && saveUser && saveUser();
    }
    // open confirm dialog
    const openConfirmDeleteDialog = async (user: IUser) => {
        if (!user || !isUUID(user.id as string)) {
            return
        }
        const result = await conFirmDialog.showConfirmation(
            'Delete Confirmation!',
            'Are you sure you want to delete this user?'
        );
        result && deleteUser && deleteUser(user.id as string);
    }

    useEffect(() => {
        if (isUserUpdateSuccess) {
            const _user: IUser = { ...isUserUpdateSuccess as IUser };
            setUsersList(usersList.map(user => {
                if (user.id === _user.id) {
                    return _user;
                }
                return user;
            }));
            alert("User updated successfully");
        }
        if (isUserUpdateError) {
            alert("User not updated message: " + isUserUpdateError);
            setIsUserUpdateError(false);
        }
    }, [isUserUpdateLoading, isUserUpdateError]);
    useEffect(() => {
        setIsUserFindAllLoading(true);
    }, []);
    useEffect(() => {
        if (isUserFindAllError) {
            setUserFindAllError(null);
            alert("Error fetching users");
        }
        if (users) {
            setUsersList(users);
        }
    }, [isUserFindAllLoading, isUserFindAllError]);
    return isUserFindAllLoading ? (<Skeleton variant="rounded" width={"100%"} height={380} />) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Grid container sx={{ gap: '1rem', }}  >
                {usersList.map((user) => (
                    <ListItem
                        key={user.id}
                        sx={{
                            display: 'flex',
                            padding: '0.5rem',
                            borderBottom: '1px solid',
                            justifyContent: 'space-between',
                        }}>
                        <Grid item xs={12} md={3} >
                            <ListItemAvatar>
                                <Avatar {...stringAvatar(user.name)} />
                            </ListItemAvatar>
                            <ListItemText primary={user.name} secondary={user.email} />
                        </Grid>
                        <Grid container item xs={12} md={6} spacing={1} direction="row"
                            justifyContent="flex-end"
                            alignItems="center">
                            {user.id === auth?.user?.id || auth?.user?.admin ? (
                                <>
                                    <Grid item xs={12} md={12} lg={3}>
                                        <Button onClick={() => openTodosDialog(user)} fullWidth variant="outlined" startIcon={<ListAlt />}>
                                            Todos
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={3}>
                                        <Button onClick={() => openUserEditDialog(user)} fullWidth variant="outlined" startIcon={<EditIcon />}>
                                            Edit
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={3}>
                                        <Button onClick={() => openConfirmDeleteDialog(user)} fullWidth variant="outlined" startIcon={<DeleteIcon />}>
                                            Delete
                                        </Button>
                                    </Grid>
                                </>

                            ) : null}
                        </Grid>
                    </ListItem>
                ))}
            </Grid>
        </List >
    );
}
export default UsersList;