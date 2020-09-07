function startAnimation() {
    var promo_div = document.getElementById("promo_div");
    promo_div.classList.add("fade_out_promo");

    setTimeout(()=>{
        var qustion_div = document.getElementById("qustion_div");
        qustion_div.classList.remove("hide_before_animation");
        qustion_div.classList.add("fade_in_question_div");
    },1000)

}

function closePromo() {
    startAnimation()
}

