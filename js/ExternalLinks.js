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

function searchFilter() {
    var input, filter, txtValue;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    document.querySelectorAll(".toggleable").forEach(item => {
        item.style.display = "block";

        item.querySelectorAll(".toggle-ctrl").forEach(p5 => {
            p5.style.display = "none";
        })

        item.querySelectorAll(".org-sep").forEach(sep => {
            sep.style.display = "none";
        })

        item.querySelectorAll("p.fs-6").forEach(p6 => {
            txtValue = p6.textContent || p6.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                p6.style.display = "block";
            } else {
                p6.style.display = "none";
            }
        })

        if(!input.value) {
            item.style.display = "none";
            item.querySelectorAll(".toggle-ctrl").forEach(p5 => {
                p5.style.display = "";
            })
            item.querySelectorAll(".org-sep").forEach(sep => {
                sep.style.display = "";
            })
            item.querySelectorAll("p.fs-6").forEach(p6 => {
                p6.style.display = "";
            })
        }
    })
}