function idleTimer() {
    let t;
    window.onmousemove = resetTimer; // catches mouse movements
    window.onmousedown = resetTimer; // catches mouse movements
    window.onclick = resetTimer;     // catches mouse clicks
    window.onscroll = resetTimer;    // catches scrolling
    window.onkeypress = resetTimer;  // catches keyboard actions

    function logout() {
        window.location.assign('http://localhost:3000');
        alert('You were removed due to inactivity');
    }

    function resetTimer() {
        clearTimeout(t);
        t = setTimeout(logout, 900000);
    }
}
idleTimer();