package middleware

import (
	"fmt"
	controller "gofiber/src/controllers/utility"
	mixin "gofiber/src/app/utility/mixins"
)

//Exceptions func
func Exceptions(err interface{}) {
	//notify admin of this panic
	sendAdminEmailOnServerCrash(err)
}

func sendAdminEmailOnServerCrash(err interface{}) {
	message := "Server encountered a serious crash error<br><br>Error Message: <strong>" +
		fmt.Sprintf("%v", err) +
		".</strong><br><br>Please treat as urgent as possible. Resolve this issue and restart the server ASAP!!!"

	controller.SendAdminEmail(mixin.AppName+" Crash Report", message, "report")
}