import React, { useState, useEffect, useContext } from 'react';
import {
    Grid,
    Button,
    Typography,
    TextField,
} from '@material-ui/core';
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from '../components/AlertDialog';
import { makeStyles } from '@material-ui/core/styles';
import UsersCombo from '../components/UsersCombo';
import { FirebaseContext } from 'common';
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    container: {
        zIndex: "12",
        color: "#FFFFFF",
    },
    title: {
        color: "#000",
    },
    gridcontainer: {
        alignContent: 'center'
    },
    items: {
        margin: 0,
        width: '100%'
    },
    input: {
        fontSize: 18,
        color: "#000"
    },
    inputdimmed: {
        fontSize: 18,
        color: "#737373"
    },
    carphoto: {
        height: '18px',
        marginRight: '10px'
    },
    buttonStyle: {
        margin: 0,
        width: '100%',
        height: '100%'
    },
    label: {
        transformOrigin: "top right",
        right: 0,
        left: "auto"
    },
    inputRtl: {
        "& label": {
            right: 20,
            left: "auto"
        },
        "& legend": {
            textAlign: "right"
        }
    }
}));

export default function AddMoney(props) {
    const { api } = useContext(FirebaseContext);
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir();
    const auth = useSelector(state => state.auth);
    const settings = useSelector(state => state.settingsdata.settings);
    const providers = useSelector(state => state.paymentmethods.providers);
    const [profile, setProfile] = useState();
    const dispatch = useDispatch();
    const classes = useStyles();
    const [commonAlert, setCommonAlert] = useState({ open: false, msg: '' });
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (auth.info && auth.info.profile) {
            setProfile(auth.info.profile);
        } else {
            setProfile(null);
        }
    }, [auth.info]);


    const handleCommonAlertClose = (e) => {
        e.preventDefault();
        setCommonAlert({ open: false, msg: '' })
    };

    return (
        <div className={classes.container} style={{ direction: isRTL === 'rtl' ? 'rtl' : 'ltr' }}>
            <Grid item xs={12} sm={12} md={8} lg={8}>
                <Grid container spacing={2} >
                    <Grid item xs={12}>
                        <Typography component="h1" variant="h5" className={classes.title} style={{ textAlign: isRTL === 'rtl' ? 'right' : 'left' }}>
                            {t('my_wallet_tile')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextField
                            id="datetime-local"
                            label={t('amount')}
                            type="text"
                            variant={"outlined"}
                            fullWidth
                            className={isRTL === 'rtl' ? classes.inputRtl : classes.commonInputStyle}
                            InputProps={{
                                className: classes.input
                            }}
                            value={amount}
                            onChange={event => {
                                const { value } = event.target;
                                setAmount(value === '' || value === null || value === undefined ? 0 : parseFloat(value));
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <Button
                            size="large"

                            variant="contained"
                            color="primary"
                            className={classes.buttonStyle}
                        >
                            {t('add_to_wallet')}
                        </Button>
                    </Grid>

                </Grid>
            </Grid>
            <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>{commonAlert.msg}</AlertDialog>
            notificationdata.loading? <CircularLoading />:
            <MaterialTable
                title={t('push_notification_title')}
                columns={columns}
                data={data}
                localization={{
                    body: {
                        addTooltip: (t('add')),
                        deleteTooltip: (t('delete')),
                        editTooltip: (t('edit')),
                        emptyDataSourceMessage: (
                            (t('blank_message'))
                        ),
                        editRow: {
                            deleteText: (t('delete_message')),
                            cancelTooltip: (t('cancel')),
                            saveTooltip: (t('save'))
                        },
                    },
                    toolbar: {
                        searchPlaceholder: (t('search')),
                        exportTitle: (t('export')),
                    },
                    header: {
                        actions: (t('actions'))
                    },
                    pagination: {
                        labelDisplayedRows: ('{from}-{to} ' + (t('of')) + ' {count}'),
                        labelRowsSelect: (t('rows')),
                        firstTooltip: (t('first_page_tooltip')),
                        previousTooltip: (t('previous_page_tooltip')),
                        nextTooltip: (t('next_page_tooltip')),
                        lastTooltip: (t('last_page_tooltip'))
                    },
                }}
            />
            {selectedBooking && selectedBooking.status === 'PENDING' && role === 'rider' ?
                <Modal
                    disablePortal
                    disableEnforceFocus
                    disableAutoFocus
                    open={paymentModalStatus}
                    onClose={handlePaymentModalClose}
                    className={classes.modal}
                    container={() => rootRef.current}
                >
                    <Grid container spacing={2} className={classes.paper}>
                        {providers && selectedProvider && selectedBooking ?
                            <form action={selectedProvider.link} method="POST">
                                <input type='hidden' name='order_id' value={selectedBooking.id} />
                                <input type='hidden' name='amount' value={selectedBooking.paymentPacket.payableAmount} />
                                <input type='hidden' name='currency' value={settings.code} />
                                <input type='hidden' name='product_name' value={t('bookingPayment')} />
                                <input type='hidden' name='first_name' value={auth.info.profile.firstName} />
                                <input type='hidden' name='last_name' value={auth.info.profile.lastName} />
                                <input type='hidden' name='quantity' value={1} />
                                <input type='hidden' name='cust_id' value={selectedBooking.customer} />
                                <input type='hidden' name='mobile_no' value={selectedBooking.customer_contact} />
                                <input type='hidden' name='email' value={selectedBooking.customer_email} />
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend" style={{ textAlign: isRTL === 'rtl' ? 'right' : 'left' }}>{t('payment')}</FormLabel>
                                        <RadioGroup name="selectedProviderIndex" value={selectedProviderIndex} onChange={handleChange}>
                                            {providers.map((provider, index) =>
                                                <FormControlLabel key={provider.name} value={index} control={<Radio />} label={<img style={{ height: 24, margin: 7 }} src={icons[provider.name]} alt={provider.name} />} />
                                            )}
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} style={{ direction: isRTL === 'rtl' ? 'rtl' : 'ltr' }}>
                                    <Button onClick={handlePaymentModalClose} variant="contained" color="primary">
                                        {t('cancel')}
                                    </Button>
                                    <Button variant="contained" color="primary" type="submit" style={isRTL === 'rtl' ? { marginRight: 10 } : { marginLeft: 10 }} onClick={handlePaymentModalClose}>
                                        {t('paynow_button')}
                                    </Button>
                                </Grid>
                            </form>
                            : null}
                    </Grid>
                </Modal>
                : null}
        </div>
    );
}