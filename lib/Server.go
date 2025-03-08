package TRC

import (
	"fmt"
	"net/http"
	"text/template"
)

type Server struct{}

func (serv *Server) Run() {
	http.HandleFunc("/css/", serv.staticFileHandler)
	http.HandleFunc("/artist/", serv.ArtistHandler)
	http.HandleFunc("/", serv.homeHandler)
	http.HandleFunc("/js/", serv.JsHandler)

	http.ListenAndServe(":8082", nil)
}

func (serv *Server) homeHandler(Writer http.ResponseWriter, Request *http.Request) {
	err := FetchArtists()
	if err != nil {
		fmt.Println(err)
		return
	}
	if Request.URL.Path != "/" {
		renderErrorPage(Writer, "Not Found", http.StatusNotFound)
		return
	}
	if Request.Method != http.MethodGet {
		renderErrorPage(Writer, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	temp, err := template.ParseFiles("templates/index.html")
	if err != nil {
		renderErrorPage(Writer, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if err := temp.Execute(Writer, Artists); err != nil {
		renderErrorPage(Writer, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

func (serv *Server) staticFileHandler(Writer http.ResponseWriter, Request *http.Request) {
	if Request.Method != http.MethodGet || Request.URL.Path == "/css/" {
		renderErrorPage(Writer, "Access Forbiden!", http.StatusForbidden)
		return
	} else if Request.URL.Path != "/css/profile.css" && Request.URL.Path != "/css/styles.css" {
		renderErrorPage(Writer, "NOT FOUND", http.StatusNotFound)
		return
	}

	fileCssServe := http.FileServer(http.Dir("css"))
	http.StripPrefix("/css/", fileCssServe).ServeHTTP(Writer, Request)
}

func (serv *Server) JsHandler(Writer http.ResponseWriter, Request *http.Request) {
	if Request.Method != http.MethodGet || Request.URL.Path == "/js/" {
		renderErrorPage(Writer, "Access Forbiden!", http.StatusForbidden)
		return
	} else if Request.URL.Path != "/js/main.js" && Request.URL.Path != "/js/artist.js"  && Request.URL.Path != "/js/filter.js"{
		renderErrorPage(Writer, "NOT FOUND", http.StatusNotFound)
		return
	}

	fileCssServe := http.FileServer(http.Dir("js"))
	http.StripPrefix("/js/", fileCssServe).ServeHTTP(Writer, Request)
}


func (serv *Server) ArtistHandler(Writer http.ResponseWriter, Request *http.Request) {
	if Request.URL.Path == "/artist/" || Request.Method != "GET" {
		renderErrorPage(Writer, "bad request.", http.StatusBadRequest)
		return
	}

	t, err := template.ParseFiles("templates/profile.html")
	if err != nil {
		renderErrorPage(Writer, "internal server error", http.StatusInternalServerError)
		return
	}

	ID := string(Request.URL.Path)[len("/artist/"):]

	if Atoi(ID) > len(Artists) || Atoi(ID) < 1 {
		renderErrorPage(Writer, "Not Found", http.StatusNotFound)
		return
	}
	errFetchOtherData := Artists[Atoi(ID)-1].FetchOtherData()
	if errFetchOtherData != nil {
		fmt.Println(errFetchOtherData)
		return
	}

	if err := t.Execute(Writer, Artists[Atoi(ID)-1]); err != nil {
		renderErrorPage(Writer, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}
