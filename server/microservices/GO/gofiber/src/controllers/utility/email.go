package controller

import (
	"fmt"
	"io/ioutil"
	"log"
	model "gofiber/src/app/utility/appmodel"
	mixin "gofiber/src/app/utility/mixins"
	"strings"
	"time"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

var canHavePredefinedHeaderAndFooter = []string{
	"welcome",
	"code",
	"subscribe",
	"unsubscribe",
	"report",
}

//SendEmail ...
func SendEmail(email *model.Email) error {
	from := mail.NewEmail(mixin.AppName, mixin.Config("EMAIL_SENDER"))
	subject := email.Subject
	to := mail.NewEmail(email.ReceiverName, email.ReceiverEmail)

	year, _, _ := time.Now().Date()

	email.Replacer["%current_year%"] = fmt.Sprintf("%d", year)
	if email.Replacer["%title%"] == "" {
		email.Replacer["%title%"] = email.Subject
	}

	var htmlContent string

	content, _ := ReadFile(email.FileName)

	if mixin.Contains(canHavePredefinedHeaderAndFooter, email.FileName) {
		header, _ := ReadFile("header")
		footer, _ := ReadFile("footer")

		htmlContent = header + Replacer(content, email.Replacer) + footer
	} else {
		htmlContent = Replacer(content, email.Replacer)
	}

	message := mail.NewSingleEmail(from, subject, to, "", htmlContent)
	client := sendgrid.NewSendClient(mixin.Config("EMAIL_PASSWORD"))
	response, err := client.Send(message)
	if err != nil {
		log.Println("Error Sending Email:", err)
	} else {
		log.Println("Email StatusCode:", response.StatusCode)
	}

	return err
}

//Replacer replaces the contents in the email template
func Replacer(s string, rep map[string]string) string {
	content := s
	for k, v := range rep {
		content = strings.ReplaceAll(content, k, v)
	}
	return content
}

//ReadFile ...
func ReadFile(filename string) (string, error) {
	b, err := ioutil.ReadFile("./public/emailTemplates/" + filename + ".html")
	if err != nil {
		fmt.Println("Reading Email Template Error For "+filename+":", err.Error())
	}
	return string(b), err
}

//SendAdminEmail
func SendAdminEmail(subject string, message string, filename string) {
	emailModel := &model.Email{
		ReceiverEmail: mixin.ImportantReportReceiver["email"],
		ReceiverName:  mixin.ImportantReportReceiver["name"],
		Subject:       subject,
		FileName:      filename,
		Replacer: map[string]string{
			"%message%": message,
		},
	}

	SendEmail(emailModel)
}
