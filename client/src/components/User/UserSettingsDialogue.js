import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, IconButton } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const UserSettingsModal = ({ open, onClose, onSave, userData }) => {

    const [userInfo, setUserInfo] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        setUserInfo({
            name: userData?.userName,
            email: userData?.email || '',
            password: ''
        })
    }, [userData])


    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserInfo(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSave = () => {
        const dataToSave = {
            name: userInfo.name,
            email: userInfo.email,
            ...(userInfo.password && {password: userInfo.password})
        };
        onSave(dataToSave);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>User Settings</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="name"
                    value={userInfo.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    name="email"
                    value={userInfo.email}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    name="password"
                    placeholder="Enter new password"
                    value={userInfo.password}
                    onChange={handleChange}
                    helperText="Leave blank to keep the current password."
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                onClick={togglePasswordVisibility}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        ),
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserSettingsModal;
