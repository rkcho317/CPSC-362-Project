let count = 0

fetch("https://saurav.tech/NewsAPI/top-headlines/category/health/us.json")
.then(response => {
    return response.json()
})
.then(jsonObject => {
    jsonObject.articles.forEach(newsItem => {

        if (newsItem.title.toLowerCase().includes("covid") ||
        newsItem.title.toLowerCase().includes("vaccin")) {

            if (count == 0) {
                let headline = document.querySelector("#headline-div")
                headline.childNodes[3].text = formatTitle(newsItem.title, newsItem.source.name)
                headline.childNodes[3].href = newsItem.url
                headline.style.backgroundImage = "url(" + newsItem.urlToImage + ")"

                //set date and publisher
                headline.childNodes[5].innerHTML = formatDate(newsItem.publishedAt)
                let headlinePublisher = document.querySelector(".headline-publisher")
                headlinePublisher.textContent = newsItem.source.name
            } else {

                let gridItem = document.querySelector(".news-article").cloneNode(true)
                let gridContainer = document.querySelector("#grid-container")

                //image
                gridItem.childNodes[1].src = newsItem.urlToImage
                
                //title
                gridItem.childNodes[3].text = formatTitle(newsItem.title, newsItem.source.name)
                gridItem.childNodes[3].href = newsItem.url

                //description
                gridItem.childNodes[5].innerHTML = newsItem.description

                //date
                gridItem.childNodes[7].innerHTML = formatDate(newsItem.publishedAt)

                //source
                gridItem.childNodes[9].innerHTML = newsItem.source.name

                //set the visibility of the article
                gridItem.style.display="block"

                gridContainer.appendChild(gridItem)
            }
            count++
        }

    })
})

function formatDate(date) {
    const index = date.indexOf("T")
    return date.substring(0, index)
}

function formatTitle(title, publisherName) {
    const index = title.indexOf(publisherName)
    if(index > 0) {
        return title.substring(0,index-3)
    }
    return title
}