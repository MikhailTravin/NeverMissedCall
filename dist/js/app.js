(() => {
    "use strict";
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerClose.classList.remove("_spoller-active");
                    _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                }));
            }));
        }
    }
    function menuInit() {
        const shadow = document.querySelector(".shadow");
        if (document.querySelector(".menu__icon")) {
            document.addEventListener("click", (function(e) {
                if (bodyLockStatus && e.target.closest(".menu__icon")) {
                    bodyLockToggle();
                    document.documentElement.classList.toggle("menu-open");
                }
            }));
            shadow.addEventListener("click", (function(e) {
                bodyUnlock();
                document.documentElement.classList.remove("menu-open");
            }));
        }
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function indents() {
        const header = document.querySelector(".header");
        const page = document.querySelector(".page");
        let hHeader = window.getComputedStyle(header, false).height;
        hHeader = Number(hHeader.slice(0, hHeader.length - 2));
        if (page) page.style.paddingTop = hHeader + "px";
    }
    window.addEventListener("scroll", (() => {
        indents();
    }));
    window.addEventListener("resize", (() => {
        indents();
    }));
    indents();
    document.addEventListener("DOMContentLoaded", (function() {
        const phoneBlocks = document.querySelectorAll(".form__select");
        phoneBlocks.forEach((block => {
            const selectTrigger = block.querySelector(".country-select-trigger");
            const phoneInput = block.querySelector(".phone-input");
            block.querySelector(".form__body");
            const flagImg = selectTrigger.querySelector(".flag");
            let currentCode = "+49";
            phoneInput.value = currentCode;
            selectTrigger.addEventListener("click", (function(e) {
                e.stopPropagation();
                document.querySelectorAll(".form__select").forEach((b => {
                    if (b !== block) b.classList.remove("active");
                }));
                block.classList.toggle("active");
            }));
            block.querySelectorAll(".country-option").forEach((option => {
                option.addEventListener("click", (function() {
                    const code = this.getAttribute("data-code");
                    const flag = this.querySelector(".flag").src;
                    const userInput = phoneInput.value.replace(currentCode, "").trim();
                    currentCode = code;
                    flagImg.src = flag;
                    phoneInput.value = code + (userInput ? " " + userInput : "");
                    block.classList.remove("active");
                    phoneInput.focus();
                }));
            }));
            phoneInput.addEventListener("keydown", (function(e) {
                const cursorPos = this.selectionStart;
                if ([ 8, 46, 37, 38, 39, 40 ].includes(e.keyCode)) {
                    if ((e.keyCode === 8 || e.keyCode === 46) && cursorPos <= currentCode.length) e.preventDefault();
                    return;
                }
                if (cursorPos < currentCode.length) e.preventDefault();
            }));
            phoneInput.addEventListener("input", (function() {
                const userInput = this.value.slice(currentCode.length).replace(/\D/g, "");
                this.value = currentCode + (userInput ? " " + userInput : "");
            }));
            phoneInput.addEventListener("paste", (function(e) {
                e.preventDefault();
                const pastedText = (e.clipboardData || window.clipboardData).getData("text");
                const digitsOnly = pastedText.replace(/\D/g, "");
                const startPos = this.selectionStart;
                if (startPos >= currentCode.length) {
                    const before = this.value.substring(0, startPos);
                    const after = this.value.substring(this.selectionEnd);
                    this.value = before + digitsOnly + after;
                    const newPos = startPos + digitsOnly.length;
                    this.setSelectionRange(newPos, newPos);
                }
            }));
        }));
        document.addEventListener("click", (function() {
            document.querySelectorAll(".form__select").forEach((block => {
                block.classList.remove("active");
            }));
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const videoBody = document.querySelector(".video__body");
        const videoElement = videoBody.querySelector(".video__element");
        const playButton = videoBody.querySelector(".video__play");
        function toggleVideo() {
            if (videoElement.paused) {
                videoElement.play();
                playButton.style.display = "none";
            } else {
                videoElement.pause();
                playButton.style.display = "block";
            }
        }
        playButton.addEventListener("click", (function(e) {
            e.stopPropagation();
            toggleVideo();
        }));
        videoBody.addEventListener("click", (function() {
            toggleVideo();
        }));
        videoElement.addEventListener("pause", (function() {
            playButton.style.display = "block";
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        const radioButtons = document.querySelectorAll(".options__input");
        const pricingColumns = document.querySelectorAll(".pricing__column");
        radioButtons.forEach((radio => {
            radio.addEventListener("change", (function() {
                pricingColumns.forEach((column => {
                    column.classList.remove("_active");
                }));
                if (this.checked) {
                    const targetCategory = this.getAttribute("data-filter");
                    const targetColumn = document.querySelector(`.pricing__column[data-categore="${targetCategory}"]`);
                    if (targetColumn) targetColumn.classList.add("_active");
                }
            }));
        }));
    }));
    document.querySelector(".footer__arrow").addEventListener("click", (function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }));
    window["FLS"] = false;
    menuInit();
    spollers();
})();