document.querySelectorAll('.toggle-ctrl').forEach(item => {
  item.addEventListener('click', toggleList, false);
})

function toggleList() {
    item = this.nextElementSibling;
    if (item.style.display === "none") {
        item.style.display = "block";
    } else {
        item.style.display = "none";
    }
}