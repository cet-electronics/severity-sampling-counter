
const userLocale =
    navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;


const result_fmt = new Intl.NumberFormat(userLocale, { maximumSignificantDigits: 3 });

const audio = new Audio("./sounds/mixkit-handgun-click-1660.mp3");

window.onload = function () {
    //document.querySelector(".navbar-brand").textContent = document.title;
    document.querySelector("#reset").onclick = hReset;
    build();
    store.load();
}

function build() {
    const perc = [
        "0%",
        "0-2.5%",
        "2.5-5%",
        "5-10%",
        "10-25%",
        "25-50%",
        "50-75%",
        "75-100%",
    ];
    const colors = [
        "#e2efd9",
        "#fef2cb",
        "#ffe598",
        "#ffd965",
        "#ffc000",
        "#f4b083",
        "#ed7d31",
        "#c00000",
    ];
    const tpl = document.querySelector("#tpl-riga");
    const ctr = document.querySelector("#ctr-righe");
    for (let i = 0; i < perc.length; i++) {
        const inst = tpl.content.cloneNode(true);
        inst.querySelector(".riga-content-index").textContent = i;
        inst.querySelector(".cls-img").src = `./images/leaf-${i}.png`;
        inst.querySelector(".cls-perc").textContent = perc[i];
        inst.querySelector(".riga-content").style.backgroundColor = colors[i];
        inst.querySelector(".riga").style.borderColor = colors[i];
        const buttons = inst.querySelectorAll("button");
        buttons[0].onclick = () => {
            store.step(i, -1);
        }
        buttons[1].onclick = () => {
            store.step(i, 1);
        }
        ctr.appendChild(inst);
    }
}


const store = (function (cb) {

    const key = "counters";
    const size = 8;
    let counters;

    function step(index, delta) {
        counters[index] = Math.max(0, counters[index] + delta);
        save();
        audio.play();
        cb(counters);
    }

    function reset() {
        counters = Array(size).fill(0);
        save();
        audio.play();
        cb(counters);
    }

    function load() {
        try {
            counters = JSON.parse(
                window.localStorage.getItem(key)
            )
        }
        catch { }
        if (!Array.isArray(counters) || counters.length !== size) {
            reset();
        }
        else {
            cb(counters);
        }
    }

    function save() {
        window.localStorage.setItem(key, JSON.stringify(counters));
    }

    return {
        step,
        reset,
        load,
    }
})(
    function (counters) {
        let total = 0;
        let weighted = 0;
        const rows = document.querySelectorAll(".riga");
        for (let i = 0; i < counters.length; i++) {
            const c = counters[i];
            rows[i].querySelector(".riga-content-value").textContent = c;
            const btn = rows[i].querySelector("button");
            btn.disabled = c <= 0;
            btn.style.opacity = btn.disabled ? 0.25 : "initial";
            total += c;
            weighted += i * c;
        }
        document.querySelector("#tot-count").textContent = total;

        document.querySelector("#incidence").textContent = total > 0
            ? result_fmt.format((total - counters[0]) / total)
            : "n/a";

        document.querySelector("#severity").textContent = total > 0
            ? result_fmt.format(weighted / total)
            : "n/a";
    }
);


function hReset() {
    //new bootstrap.Collapse(
    //    document.querySelector(".collapse")
    //).hide();
    if (window.confirm("Confirm to reset the counters?")) {
        store.reset();
    }
}
