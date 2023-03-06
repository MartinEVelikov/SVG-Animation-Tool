window.app = {
    data: [],
    svgs: [],
    styles: {},
    activeSvg: null,
    activeChild: null
};
const validTags = ["svg", "g", "path"];

function init() {
    fetch('./endpoints/svg.php')
        .then(res => res.json())
        .then(data => {
            loaded(data);
        });
}

function loaded(res) {
    const svgHolder = document.getElementById('svgs');

    window.app.data = res;
    initInputEvents();
    initSvgUpload();

    res.forEach(s => {
        const div = document.createElement('div');
        div.className = 'svgDiv';
        div.setAttribute('data-svg-id', s.id);
        div.innerHTML = s.content;
        svgHolder.appendChild(div);
        window.app.svgs.push(div);

        if (s.styles) {
            window.app.styles[s.id] = JSON.parse(s.styles);
        }

        div.onclick = function (e) {
            const animatePanel = document.getElementById('animatePanel');
            animatePanel.classList.add('disabled');

            window.app.svgs.forEach(svg => {
                svg.classList.remove('active');
            });
            e.target.classList.add('active');

            const svgTree = document.getElementById('treeContent');
            svgTree.innerHTML = '';
            const svgElement = e.target.querySelector('svg');
            const svgId = e.target.getAttribute('data-svg-id');
            window.app.activeSvg = svgId;
            window.app.hoverId = 0;
            window.app.activeChild = null;
            traverse(svgElement, 0, svgTree);
            clearInput();

            function traverse(element, depth, parent) {
                if (validTags.indexOf(element.tagName) !== -1) {
                    const hoverId = window.app.hoverId;
                    const domEl = document.createElement('div');
                    domEl.className = 'svgTag';
                    domEl.innerHTML = element.tagName;
                    domEl.setAttribute('data-hover-id', hoverId);
                    domEl.style.marginLeft = `${15 * depth}px`;
                    parent.appendChild(domEl);

                    domEl.onmouseover = function () {
                        const hovered = document.querySelector(`#animationPreview #svgPanel ${element.tagName}[data-hover-id="${hoverId}"]`);
                        const animationPanelBounds = document.getElementById('animationPreview').getBoundingClientRect();
                        const bounds = hovered.getBoundingClientRect();
                        const hoverDiv = document.getElementById('hoverDiv');
                        hoverDiv.style.width = `${bounds.width}px`;
                        hoverDiv.style.height = `${bounds.height}px`;
                        hoverDiv.style.left = `${bounds.left}px`;
                        hoverDiv.style.top = `${bounds.top - animationPanelBounds.top}px`;
                        hoverDiv.style.opacity = 1;
                    }

                    domEl.onmouseleave = function () {
                        const hovered = document.querySelector(`#animationPreview #svgPanel ${element.tagName}[data-hover-id="${hoverId}"]`);
                        const hoverDiv = document.getElementById('hoverDiv');
                        hoverDiv.style.opacity = 0;
                    }

                    domEl.onclick = function (e) {
                        animatePanel.classList.remove('disabled');

                        const actives = [...document.querySelectorAll('#treeContent .active')];
                        actives.forEach(el => el.classList.remove('active'));
                        e.target.classList.add('active');
                        window.app.activeChild = e.target.getAttribute('data-hover-id');
                        clearInput();
                    }
                }

                element.setAttribute('data-hover-id', window.app.hoverId);

                for (let i = 0; i < element.children.length; i++) {
                    window.app.hoverId += 1;
                    traverse(element.children[i], depth + 1, parent);
                }
            }

            const svgPanel = document.querySelector('#animationPreview #svgPanel');
            svgPanel.innerHTML = '';
            svgPanel.appendChild(e.target.children[0].cloneNode(true));
        }
    });
}

function clearInput() {
    const inptus = [...document.querySelectorAll('#animatePanel input')];
    const selects = [...document.querySelectorAll('#animatePanel select')];
    const svgId = window.app.activeSvg;
    const activeChild = window.app.activeChild;
    let activeStyles = null;
    if (window.app.styles[svgId]) {
        activeStyles = window.app.styles[svgId][activeChild];
    }

    inptus.forEach(i => {
        if (activeStyles && activeStyles[i.id]) {
            i.value = window.app.styles[svgId][activeChild][i.id];
        } else {
            i.value = '';
        }
    });

    selects.forEach(s => {
        if (activeStyles && activeStyles[s.id]) {
            s.value = window.app.styles[svgId][activeChild][s.id];
        } else {
            s.selectedIndex = 0;
        }
    });
}

function initInputEvents() {
    const inptus = [...document.querySelectorAll('#animatePanel input')];
    inptus.forEach(i => {
        i.onkeyup = function (e) {
            const key = e.target.id;
            const value = e.target.value;

            if (!window.app.styles[window.app.activeSvg]) {
                window.app.styles[window.app.activeSvg] = {};
            }

            if (!window.app.styles[window.app.activeSvg][window.app.activeChild]) {
                window.app.styles[window.app.activeSvg][window.app.activeChild] = {};
            }

            window.app.styles[window.app.activeSvg][window.app.activeChild][key] = value;
        }
    });

    const selects = [...document.querySelectorAll('#animatePanel select')];
    selects.forEach(s => {
        s.onchange = function (e) {
            const key = e.target.id;
            const value = e.target.value;

            if (!window.app.styles[window.app.activeSvg]) {
                window.app.styles[window.app.activeSvg] = {};
            }

            if (!window.app.styles[window.app.activeSvg][window.app.activeChild]) {
                window.app.styles[window.app.activeSvg][window.app.activeChild] = {};
            }

            window.app.styles[window.app.activeSvg][window.app.activeChild][key] = value;
        }
    })

    document.getElementById('render').onclick = () => { render() };
    document.getElementById('save').onclick = () => { save() };
    document.getElementById('download').onclick = () => { download() };
}

function render() {
    const svgPanel = document.querySelector('#animationPreview #svgPanel');
    svgPanel.innerHTML = '';
    svgPanel.appendChild(document.querySelector(`.svgDiv[data-svg-id="${window.app.activeSvg}"] svg`).cloneNode(true));


    const exist = document.getElementById('animationCss');
    if (exist) {
        document.head.removeChild(exist);
    }

    const currentStyles = window.app.styles[window.app.activeSvg] || {};
    const keys = Object.keys(currentStyles);

    keys.forEach(k => {
        const elStyles = currentStyles[k];
        console.log(elStyles);
        const anim = `
        @keyframes animation-${window.app.activeSvg}-${k} {
                from {
                  transform: translate(${elStyles.xFrom || 0}, ${elStyles.yFrom || 0}) rotate(${elStyles.rotateFrom || 0}) scale(${elStyles.scaleFrom || 1});
                  opacity: ${elStyles.opacityFrom || 1};
                  stroke-dasharray: ${elStyles.dashArrayFrom || 0};
                  stroke-dashoffset: ${elStyles.dashOffsetFrom || 0};
                }
              
                to {
                    transform: translate(${elStyles.xTo || 0}, ${elStyles.yTo || 0}) rotate(${elStyles.rotateTo || 0}) scale(${elStyles.scaleTo || 1});
                    opacity: ${elStyles.opacityTo || 1};
                    stroke-dasharray: ${elStyles.dashArrayTo || 0};
                    stroke-dashoffset: ${elStyles.dashOffsetTo || 0};
                }
              }`;

        const el = document.querySelector(`#svgPanel *[data-hover-id="${k}"`);
        el.style.animation = `animation-${window.app.activeSvg}-${k} ${elStyles.duration || "2s"} ${elStyles.ease || 'ease-in'}`;
        el.style.animationDelay = `${elStyles.delay || 0}`;
        el.style.animationIterationCount = `${elStyles.repeat || 1}`;

        const styleEl = document.createElement('style');
        styleEl.id = 'animationCss';
        document.head.appendChild(styleEl);

        const css = styleEl.sheet;
        css.insertRule(anim);
        // css.insertRule(rotateRule);
        console.log(css);
    });
}

function initSvgUpload() {
    const btn = document.getElementById('showModal');
    const modal = document.getElementById('modal-addSvg');
    const textHolder = document.getElementById('svgContent');

    btn.onclick = function () {
        modal.style.display = 'block';
        textHolder.value = '';

        const submitBtn = document.getElementsByClassName('submitSvg')[0];
        submitBtn.onclick = function () {
            let text = textHolder.value;

            var fileToLoad = document.getElementById("fileToLoad").files[0];
            if (fileToLoad) {
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    var textFromFileLoaded = fileLoadedEvent.target.result;
                    text = textFromFileLoaded;
                    initUpload();
                };
    
                fileReader.readAsText(fileToLoad, "UTF-8");
            } else if (textHolder.value) {
                text = textHolder.value;
                initUpload();
            }

            function initUpload() {
                window.app.data.push({
                    id: 10,
                    data: text
                });
                modal.style.display = 'none';
                document.getElementById('svgs').innerHTML = '';
                const obj = { content: text, styles: null };
    
                fetch('./endpoints/svg.php', {
                    method: 'POST',
                    body: JSON.stringify(obj)
                }).then(res => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error();
                    }
                })
                    .then(data => {
                        modal.style.display = 'none';
                        document.getElementById('svgs').innerHTML = '';
                        init();
                    });
            }   
        }
    }

    const closeModal = document.getElementById('closeModal');
    closeModal.onclick = function () {
        modal.style.display = 'none';
    }
}

function save() {
    const currentStyles = window.app.styles[window.app.activeSvg];
    const obj = { styles: (currentStyles ? JSON.stringify(currentStyles) : null), id: window.app.activeSvg };

    fetch('./endpoints/svg.php', {
        method: 'PUT',
        body: JSON.stringify(obj)
    }).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error();
        }
    })
        .then(() => {
            alert("Saved");
            console.log("saved");
        });
}

function download() {
    const svg = document.querySelector('#animationPreview #svgPanel svg');
    let defs = svg.getElementsByTagName('defs')[0];

    if (!defs) {
        defs = document.createElement('defs');
        svg.appendChild(defs);
    }

    let exist = [...defs.getElementsByClassName('animationCss')];
    if (exist) {
        for (let i = 0; i < exist.length; i++) {
            defs.removeChild(exist[i]);
        }
    }

    const currentStyles = window.app.styles[window.app.activeSvg];
    const keys = Object.keys(currentStyles);

    keys.forEach(k => {
        const elStyles = currentStyles[k];
        const anim = `* {
            transform-origin: center;
            transform-box: fill-box;
        }
        
        @keyframes animation-${window.app.activeSvg}-${k} {
                from {
                  transform: translate(${elStyles.xFrom || 0}, ${elStyles.yFrom || 0}) rotate(${elStyles.rotateFrom || 0}) scale(${elStyles.scaleFrom || 1});
                  opacity: ${elStyles.opacityFrom || 1};
                  stroke-dasharray: ${elStyles.dashArrayFrom || 0};
                  stroke-dashoffset: ${elStyles.dashOffsetFrom || 0};
                }
              
                to {
                    transform: translate(${elStyles.xTo || 0}, ${elStyles.yTo || 0}) rotate(${elStyles.rotateTo || 0}) scale(${elStyles.scaleTo || 1});
                    opacity: ${elStyles.opacityTo || 1};
                    stroke-dasharray: ${elStyles.dashArrayTo || 0};
                    stroke-dashoffset: ${elStyles.dashOffsetTo || 0};
                }
              }`

        const el = document.querySelector(`#svgPanel *[data-hover-id="${k}"`);
        el.style.animation = `animation-${window.app.activeSvg}-${k} ${elStyles.duration || "2s"} ${elStyles.ease || 'ease-in'}`;
        el.style.animationDelay = `${elStyles.delay || 0}`;
        el.style.animationIterationCount = `${elStyles.repeat || 1}`;

        const styleEl = document.createElement('style');
        styleEl.className = 'animationCss';
        defs.appendChild(styleEl);
        styleEl.innerHTML = anim;
    });

    const output = document.getElementById('svgPanel').innerHTML;
    const obj = { content: output }

    fetch('./endpoints/download.php?', {
        method: 'POST',
        body: JSON.stringify(obj)
    }).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error();
        }
    })
        .then(() => {
            console.log("download");
            window.open('./endpoints/download.php', '_blank');
        });
}