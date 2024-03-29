import {config} from "../config.js";
import nodemailer from "nodemailer";

const {HOST_SMTP, PORT_SMTP, USER_NAME_SMTP, USER_PASSWORD_SMTP} = config;

const mailTransporterConfiguration = {
    host: HOST_SMTP,
    port: PORT_SMTP,
    auth: {
        user: USER_NAME_SMTP,
        pass: USER_PASSWORD_SMTP,
    },
    tls: {
        ciphers: 'DEFAULT',
        rejectUnauthorized: true,
    },
};

export let transporter = nodemailer.createTransport(mailTransporterConfiguration);
