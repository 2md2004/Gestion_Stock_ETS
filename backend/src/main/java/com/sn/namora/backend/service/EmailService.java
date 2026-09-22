package com.sn.namora.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendResetPasswordEmail(String to, String fullName, String resetLink)
            throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject("Réinitialisation de votre mot de passe");
        helper.setText(buildResetPasswordTemplate(fullName, resetLink), true);

        mailSender.send(message);
    }

    public void sendUserCredentialsEmail(String to,
                                         String fullName,
                                         String password)
            throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject("Création de votre compte");

        helper.setText(
                buildUserCredentialsTemplate(fullName, to, password),
                true
        );

        mailSender.send(message);
    }

    private String buildResetPasswordTemplate(String fullName, String resetLink) {

        return """
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
            </head>
            <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

            <table width="100%%" cellpadding="0" cellspacing="0" style="padding:30px;">
                <tr>
                    <td align="center">

                        <table width="600" cellpadding="0" cellspacing="0"
                               style="background:#ffffff;border-radius:8px;overflow:hidden;">

                            <tr>
                                <td style="background:#002050;padding:25px;text-align:center;">
                                    <h2 style="color:#D09018;margin:0;">
                                        ETS BEUG SERIGNE MANSOUR SY
                                    </h2>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:40px;">

                                    <h3 style="color:#002050;">
                                        Bonjour %s,
                                    </h3>

                                    <p style="font-size:16px;color:#444;">
                                        Vous avez demandé la réinitialisation de votre mot de passe.
                                    </p>

                                    <p style="font-size:16px;color:#444;">
                                        Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe.
                                    </p>

                                    <div style="text-align:center;margin:35px 0;">
                                        <a href="%s"
                                           style="
                                                background:#D09018;
                                                color:white;
                                                text-decoration:none;
                                                padding:14px 28px;
                                                border-radius:5px;
                                                font-weight:bold;
                                                display:inline-block;">
                                            Réinitialiser mon mot de passe
                                        </a>
                                    </div>

                                    <hr>

                                    <p style="font-size:13px;color:#888;text-align:center;">
                                        © ETS BEUG SERIGNE MANSOUR SY
                                    </p>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

            </body>
            </html>
            """.formatted(fullName, resetLink);
    }

    private String buildUserCredentialsTemplate(String fullName,
                                                String email,
                                                String password) {

        return """
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
            </head>
            <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

            <table width="100%%" cellpadding="0" cellspacing="0" style="padding:30px;">
                <tr>
                    <td align="center">

                        <table width="600" cellpadding="0" cellspacing="0"
                               style="background:#ffffff;border-radius:8px;overflow:hidden;">

                            <tr>
                                <td style="background:#002050;padding:25px;text-align:center;">
                                    <h2 style="color:#D09018;margin:0;">
                                        ETS BEUG SERIGNE MANSOUR SY
                                    </h2>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:40px;">

                                    <h3 style="color:#002050;">
                                        Bonjour %s,
                                    </h3>

                                    <p style="font-size:16px;color:#444;">
                                        Votre compte a été créé avec succès.
                                    </p>

                                    <p style="font-size:16px;color:#444;">
                                        Voici vos informations de connexion :
                                    </p>

                                    <table cellpadding="10" cellspacing="0"
                                           style="width:100%%;border-collapse:collapse;border:1px solid #ddd;">

                                        <tr>
                                            <td style="background:#f2f2f2;font-weight:bold;">
                                                Email
                                            </td>
                                            <td>%s</td>
                                        </tr>

                                        <tr>
                                            <td style="background:#f2f2f2;font-weight:bold;">
                                                Mot de passe
                                            </td>
                                            <td>%s</td>
                                        </tr>

                                    </table>

                                    <br>

                                    <p style="font-size:15px;color:#444;">
                                            Pour des raisons de sécurité, veuillez conserver ce mot de passe confidentiel
                                            et ne le communiquer à personne.
                                    </p>

                                    <hr>

                                    <p style="font-size:13px;color:#888;text-align:center;">
                                        © ETS BEUG SERIGNE MANSOUR SY
                                    </p>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

            </body>
            </html>
            """.formatted(fullName, email, password);
    }
}