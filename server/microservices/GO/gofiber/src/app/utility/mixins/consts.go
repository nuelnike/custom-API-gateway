package mixin

import "time"

var (
	AppName = "GiftBox"
	PageSize = 10

	ALLOWED_METHODS = "GET,POST,DELETE"
	ALLOWED_API_KEYS = "main-api-gateway"
	ALLOWED_ORIGINS = "http://localhost:3000" //on production, remove the http://localhost:5597 so that only order_management.com has access to this backend service
	ALLOWED_HEADERS = "Origin, Content-Type, Accept, x-access-token, Api-key"

	//Routes to be cached. e.g GET requests for "/blog", "/shop" etc
	CachedRoutes = map[string]time.Duration{
		"/order": 5,
		"/product": 5,
		"/auth": 5,
	}

	//Important email receiver. Maybe on server crash or critical error
	ImportantReportReceiver = map[string]string{
		"name":  AppName,
		"email": Config("EMAIL_RECEIVER"),
	}

	//Submission statuses
	SubmissionApproved = "approved"
	SubmissionPending  = "pending"
	SubmissionRejected = "rejected"

	//User roles
	SuperAdmin = "super_admin"
	Admin      = "admin"
	Moderator  = "moderator"
	Default    = "default"
	BlogAccess       = []string{SuperAdmin, Admin, Moderator}
	AdminsAccess     = []string{SuperAdmin, Admin}
	UserAccess       = []string{Default}
	ModeratorAccess  = []string{Moderator, Default}
	AdminAccess      = []string{Default, Moderator, Admin}
	SuperAdminAccess = []string{Default, Moderator, Admin, SuperAdmin}

	//User statuses
	SystemActive  = "active"
	SystemBanned  = "banned"
	SystemDeleted = "deleted"
)
