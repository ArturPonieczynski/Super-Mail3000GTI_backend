import {Router} from "express";
import {upload} from "../utils/multer.js";
import {MemberRecord} from "../records/member.record.js";
import {EmailService} from "../services/email.service.js";
import {ServerError} from "../utils/error.js";

export const mailRouter = Router();

mailRouter.get('/all', async (req, res) => {
    try {
        const memberList = await MemberRecord.findAll();
        res.json(memberList);
    } catch (error) {
        console.error('Error occurred on path GET /api/mail/all', error)
        throw new ServerError(`Błąd podczas ładowania książki adresów. ${error.message}`, error);
    }
});

mailRouter.post('/', upload.single('file'), async (req, res) => {
    try {
        EmailService.sendEmail(req); // This function will return a promise until the email has been successfully dispatched
        res.json({ok: true});
    } catch (error) {
            console.error('Error occurred on path POST /api/email.', error);
            throw new ServerError(`Błąd wysyłania wiadomości email. ${error.message}`, error);
    }
});
