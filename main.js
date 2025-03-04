    import { Elemental, passAlongProps } from "https://esm.sh/gh/jeff-hykin/elemental@0.6.5/main/deno.js"
    // import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/elements.js"
    // import { fadeIn, fadeOut } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/animations.js"
    // import { showToast } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/actions.js"
    // import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/helpers.js"
    // import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/array.js"

    // import storageObject from "https://esm.sh/gh/jeff-hykin/storage-object@0.0.3.5/main.js"

    // const { html } = Elemental({
    //     ...components,
    // })

    // document.body = html`
    //     <body font-size=15px background-color=whitesmoke overflow=scroll width=100vw>
    //         <Column>
    //             <span>Howdy!</span>
    //             <span>Howdy!</span>
    //             <span>Howdy!</span>
    //         </Column>
    //     </body>
    // `
    import { getRelatedArticles } from "./open_alex.js"

// 
// 
// theme
// 
// 
    const theme = {
        farBackground: "#212B38",
        closeBackground: "#37465B",
        foregroundDim: "#08C6AB",
        foregroundBright: "#5AFFE7",
        errorColor: "#FE7A36",
        accent: "#726EFF",
    }
// 
// 
// Initialize
// 
// 
    import router from "https://esm.sh/gh/jeff-hykin/quik-router@4f1164a/main/main.js?dev"
    import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "https://deno.land/x/good_component@0.2.7/elements.js"
    import { fadeIn, fadeOut } from "https://deno.land/x/good_component@0.2.7/main/animations.js"
    import { showToast } from "https://deno.land/x/good_component@0.2.7/main/actions.js"
    import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "https://deno.land/x/good_component@0.2.7/main/helpers.js"
    import storageObject from "https://deno.land/x/storage_object@0.0.2.0/main.js"
    import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.5.1.0/array.js"
    import { ContainerLibrary } from "./container_library.js"
    
    const nullFunc = ()=>0
    const addDynamicStylerFlags = (element, flagKeys) => {
        element.dynamicStyler = element.dynamicStyler||nullFunc
        for (const [attribute, positiveEvent, negativeEvent] of flagKeys) {
            element.addEventListener(positiveEvent, ()=>{
                element[attribute] = true
                element.dynamicStyler(element)
            })
            element.addEventListener(negativeEvent, ()=>{
                element[attribute] = false
                element.dynamicStyler(element)
            })
        }
    }
    
    class StopCallingListener {
        constructor({minDelay, callback,}) {
            this.callback = callback
            this.minDelay = minDelay
            this.timeoutId = null
        }
        call(func) {
            clearTimeout(this.timeoutId)
            this.timeoutId = setTimeout(func||this.func, this.minDelay)
        }
    }
    // import * as d3 from "https://cdn.skypack.dev/d3@v7.8.5"
    // import * as d3 from "https://cdn.skypack.dev/d3@v5.16.0"
    import * as d3 from "https://esm.sh/d3@v5.16.0"
    // import * as d3 from "https://cdn.skypack.dev/d3@v4.13.0"
    
    // 
    // Custom elements
    // 
    const { html } = Elemental({
        Container: ContainerLibrary,
        Card,
        Chip,
        Title,
        AcheivementToken,
        Space,
        LinePadding,
        Graph,
    })
// 
// 
// Main Code
// 
// 
let graphContainer
let previewInfoContainer
let infoArea = html`<Container />`
const bouncedListener = new StopCallingListener({minDelay: 400})
let activeNode
document.body = html`
    <body font-size=15px color=${theme.foregroundDim} overflow=hidden>
        <Container row height="fit-content" width="100%" background="var(--soft-gray-gradient)">
            ${previewInfoContainer = html`<Container
                name="SideBar"
                column
                flex-grow="1"
                horizontalAlignment="center"
                verticalAlignment="space-between"
                height="100vh"
                min-height="40em"
                background="${theme.closeBackground}"
                min-width=14em
                max-width=28em
                width=28em
                padding=1.2rem
                overflow=visible
                z-index=1
                box-shadow="0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3)"
                >
                    <Container horizontalAlignment=center >
                        <span>Enter a DOI over there →</span>
                        <div height=3rem />
                        
                        <span>Example Paper DOI: <a href="https://sci-hub.se/10.1155/2014/413629">10.1155/2014/413629</a></span>
                    </Container>
                ${infoArea}
            </Container>`}
            ${graphContainer = html`<Container
                name="MainArea"
                column
                flex-grow="0"
                horizontalAlignment="center"
                verticalAlignment="space-between"
                height="100vh"
                min-height="40em"
                background="${theme.farBackground}"
                min-width=14em
                overflow=auto
                position=relative
                >
                <Graph
                    nodes=${[{ id: 'node1', year: "Howdy Howdy Howdy Howdy",  }, { id: 'node2' }, { id: 'node3' }]}
                    links=${[{ source: 'node1', target: 'node2' }, { source: 'node2', target: 'node3' }, { source: 'node3', target: 'node1' }]}
                    style="background: ${theme.farBackground}; width: 100%;"
                    onNodeClick=${(node)=>console.log(node)}
                    >
                </Graph>
            </Container>`}
            <Container position="fixed" top=2rem right=1rem background=white padding=1rem border-radius=1rem color=black box-shadow="0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3)">
                <input
                    width=24rem
                    outline=none
                    placeholder="Enter DOI like: 10.1155/2014/413629"
                    oninput=${(event)=>{
                        // console.log(`window.history.length is:`,window.history.length)
                        event.preventDefault()
                        bouncedListener.call(()=>{
                            showToast(`loading new nodes`, {
                                position: 'right',
                                backgroundColor: theme.accent,
                                color: 'white',
                                gravity: "bottom",
                                duration: 8000,
                            })
                            router.goTo({  path: `${Math.random()}`, doi: event.target.value })
                            
                            
                            // getNodesAndLinksFor(event.target.value).then(loadNewGraph).then(()=>{
                            //     console.log(`window.history.length is:`,window.history.length)
                            //     showToast(`Done ✅`, {
                            //         position: 'right',
                            //         backgroundColor: theme.accent,
                            //         color: 'white',
                            //         gravity: "bottom",
                            //         duration: 5000,
                            //     })
                            // })
                        })
                    }}
                    border="0px solid black"
                    border-bottom="2px solid gray"
                    />
            </Container>
        </Container>
    </body>
`
router.addEventListener("go", ((pageInfo, trigger)=>{
    // e.g. if going back in the history
    if (trigger=="popstate") {
        showToast(`loading`, {backgroundColor: theme.accent,})
    }
    getNodesAndLinksFor(pageInfo.doi).then(loadNewGraph).then(()=>{
        showToast(`Done ✅`, {
            position: 'right',
            backgroundColor: theme.accent,
            color: 'white',
            gravity: "bottom",
            duration: 5000,
        })
    })
}))
if (router.pageInfo.doi) {
    showToast(`loading (might take a moment)`)
    setTimeout(() => {
        getNodesAndLinksFor(router.pageInfo.doi).then(loadNewGraph)
    }, 0);
}
document.body.animate(...fadeIn)
// 
// 
// helpers
// 
// 
    let selectedNode
    function renderNodeSummary(nodeData, options) {
        let {withTempColoring} = options||{}
        // already selected
        if (selectedNode) {
            if (selectedNode==nodeData.DOI) {
                withTempColoring = false
            } else {
                selectedNode = nodeData.DOI
            }
        }
        let iframeWrapper, iframe, hoverMessageElement
        const summary = html`
            <Container name=summary display=relative width=100% gap=1.4rem display=flex overflow=visible flex-grow=1 opacity=${withTempColoring?0.5:1}>
                <Container name=aboveHover height=20rem max-width=100% overflow=hidden gap=1.4rem>
                    <span style="color: #FFFFFF22;">DOI: ${nodeData.DOI}</span>
                    ${nodeData.title&&html`<h4 style="color: white;font-size: 1.5em;" innerHTML=${nodeData.title}></h4>`}
                    
                    ${nodeData.authorLastName&&nodeData.yearCreated&&html`
                        <h5>
                            <a
                                href=${`https://sci-hub.hkvisa.net/${nodeData.DOI}`}
                                style="color: ${theme.foregroundDim};text-decoration: underline;font-size: 1rem;"
                                >
                                    ${nodeData.authorLastName}, ${nodeData.yearCreated}
                            </a>
                        </h5>
                    `}
                    <Container display=flex flex-grow=1 row horizontalAlignment=space-between width=100% verticalAlignment=center>
                        <button
                            style="cursor: pointer;"
                            background="${theme.accent}"
                            onclick=${(e)=>{
                                e.preventDefault()
                                let toast = showToast(`loading new nodes`, {
                                    position: 'right',
                                    backgroundColor: theme.accent,
                                    color: 'white',
                                    gravity: "bottom",
                                    duration: 8000,
                                })
                                router.goTo({ path: `${Math.random()}`, doi: nodeData.id })
                                
                                // getNodesAndLinksFor(nodeData.id).then(loadNewGraph).then(()=>{
                                //     showToast(`Done ✅`, {
                                //         position: 'right',
                                //         backgroundColor: theme.accent,
                                //         color: 'white',
                                //         gravity: "bottom",
                                //         duration: 5000,
                                //     })
                                // })
                            }}
                            >
                                Recenter on this Node
                        </button>
                    </Container>
                    ${`https://sci-hub.hkvisa.net/${nodeData.DOI}`}
                </Container>
                ${nodeData.DOI&&html`
                    ${iframeWrapper = html`
                        <div style="flex-grow: 5; overflow: auto; width: 100%; position: relative; box-shadow: 0 24px 38px 3px rgba(0,0,0,0.14),0 9px 46px 8px rgba(0,0,0,0.12),0 11px 15px -7px rgba(0,0,0,0.2);" max-height=70vh>
                            <!-- Super roundout because of https://stackoverflow.com/questions/821359/reload-an-iframe-without-adding-to-the-history -->
                            <!-- using innerHTML is the way of getter around setting it as an attribute -->
                            ${iframe = html`
                                <div innerHTML=${`
                                    <iframe style="visibility: hidden;" src=${JSON.stringify(`https://sci-hub.hkvisa.net/${nodeData.DOI}`)} height=100 width=100></iframe>
                                `}></div>`.children[0]
                            }
                            ${hoverMessageElement = html`<Container horizontalAlignment="center" verticalAlignment=center width=100% height="90%" background-color="#00000022" position="absolute" top=0>
                                <h5>
                                    Hover here to preview PDF
                                </h5>
                            </Container>`}
                        </div>
                    `}
                `}
            </Container>
        `
        if (iframeWrapper) {
            addDynamicStylerFlags(iframeWrapper, [
                ['isHovered', 'mouseover', 'mouseout'],
            ])
            iframeWrapper.dynamicStyler = ()=>{
                if (iframeWrapper.isHovered) {
                    iframe.style.visibility = "visible"
                    const {top,bottom} = iframeWrapper.getBoundingClientRect()
                    const {left,right} = document.body.getBoundingClientRect()
                    iframe.setAttribute("height", (bottom-top))
                    iframe.setAttribute("width", (right-left)*0.90)
                    iframeWrapper.style.backgroundColor = "whitesmoke"
                    iframeWrapper.style.minWidth = "fit-content"
                    hoverMessageElement.style.visibility = "hidden"
                    iframeWrapper.style.overflow = "visible"
                } else {
                    iframe.style.visibility = "hidden"
                    hoverMessageElement.style.visibility = "visible"
                    iframeWrapper.style.overflow = "auto"
                    iframeWrapper.style.minWidth = 0
                    iframeWrapper.style.backgroundColor = ""
                }
                
            }
        }
        previewInfoContainer.replaceChild(summary,previewInfoContainer.children[0])
        
        // previewInfoContainer.appendChild(summary)
        // DOI: "10.1016/j.neuroscience.2013.04.052"
        // cited: Array(66) [ "10.1016/0149-7634(80)90027-5", "10.1016/j.bbr.2007.10.010", "10.1046/j.1460-9568.2002.02043.x", … ]
        // citedBy: Array [ "10.1016/j.neuroscience.2013.04.052", "10.1155/2014/413629" ]
        // element: <circle id="10.1016/j.neuroscience.2013.04.052" r="5" style="fill: rgb(79, 79, 79); f…66); stroke-width: 0px;" cx="475.526965317753" cy="426.3633126531575">
        // id: "10.1016/j.neuroscience.2013.04.052"
        // title: "Individual differences in the effects of chronic stress on memory: Behavioral and neurochemical correlates of resiliency"
    }
    function getPaperInfo(paperOrDoi, options={}) {
        const { showError } = options
        let doiFullString = paperOrDoi
        if (paperOrDoi instanceof Object && typeof paperOrDoi.DOI == 'string') {
            doiFullString = paperOrDoi.DOI
        }
        if (!(typeof doiFullString == "string")) {
            return
        }
        const doiPart = doiFullString.match(/.*\b(10\..+\/.+)/)
        if (doiPart) {
            const doi = doiPart[1]
            // console.log(`calling: https://api.crossref.org/works/${doi}`)
            const paperPromise = fetch(`https://api.crossref.org/works/${doi}`).then(result=>result.json()).then(result=>result.message).catch(()=>{
                showError&&showToast(`Sorry :/\nIt looks like api.crossref.org doesn't have any info on that paper\n(DOI: ${doiFullString}) :/`, { backgroundColor: theme.errorColor, duration: 8000 })
            })
            return paperPromise
        }
        // result.DOI
        // result.abstract
        // result.author[0].given // first name
        // result.author[0].family // last name
        // result.created["date-time"] // string timestamp
        // result.title[0]
        // result["short-container-title"]
        // result["reference-count"]
        // {
        //     "status": "ok",
        //     "message-type": "work",
        //     "message-version": "1.0.0",
        //     "message": {
        //         "indexed": {
        //             "date-parts": [
        //                 [
        //                     2023,
        //                     9,
        //                     3
        //                 ]
        //             ],
        //             "date-time": "2023-09-03T04:57:00Z",
        //             "timestamp": 1693717020763
        //         },
        //         "reference-count": 60,
        //         "publisher": "Hindawi Limited",
        //         "license": [
        //             {
        //                 "start": {
        //                     "date-parts": [
        //                         [
        //                             2014,
        //                             1,
        //                             1
        //                         ]
        //                     ],
        //                     "date-time": "2014-01-01T00:00:00Z",
        //                     "timestamp": 1388534400000
        //                 },
        //                 "content-version": "unspecified",
        //                 "delay-in-days": 0,
        //                 "URL": "http://creativecommons.org/licenses/by/3.0/"
        //             }
        //         ],
        //         "funder": [
        //             {
        //                 "name": "ITMS 26240120020-Establishment of the Centre for the Research on Composite Materials for Structural Engineering and Medical Applications-CEKOMAT II.",
        //                 "award": [
        //                     "VEGA 2/0084/10",
        //                     "APVV-0523-10"
        //                 ]
        //             }
        //         ],
        //         "content-domain": {
        //             "domain": [],
        //             "crossmark-restriction": false
        //         },
        //         "short-container-title": [
        //             "BioMed Research International"
        //         ],
        //         "published-print": {
        //             "date-parts": [
        //                 [
        //                     2014
        //                 ]
        //             ]
        //         },
        //         "abstract": "<jats:p>This study investigated the influence of chronic crowding stress on nitric oxide (NO) production, vascular function and oxidative status in young Wistar-Kyoto (WKY), borderline hypertensive (BHR) and spontaneously hypertensive (SHR) female rats. Five-week old rats were exposed to crowding for two weeks. Crowding elevated plasma corticosterone<mml:math xmlns:mml=\"http://www.w3.org/1998/Math/MathML\" id=\"M1\"><mml:mo stretchy=\"false\">(</mml:mo><mml:mi>P</mml:mi><mml:mo>&lt;</mml:mo><mml:mn>0.05</mml:mn><mml:mo stretchy=\"false\">)</mml:mo></mml:math>and accelerated BP (<mml:math xmlns:mml=\"http://www.w3.org/1998/Math/MathML\" id=\"M2\"><mml:mi>P</mml:mi><mml:mo>&lt;</mml:mo><mml:mn>0.01</mml:mn></mml:math>versus basal) only in BHR. NO production and superoxide concentration were significantly higher in the aortas of control BHR and SHR versus WKY. Total acetylcholine (ACh)-induced relaxation in the femoral artery was reduced in control SHR versus WKY and BHR, and stress did not affect it significantly in any genotype. The attenuation of ACh-induced relaxation in SHR versus WKY was associated with reduction of its NO-independent component. Crowding elevated NO production in all strains investigated but superoxide concentration was increased only in WKY, which resulted in reduced NO-dependent relaxation in WKY. In crowded BHR and SHR, superoxide concentration was either unchanged or reduced, respectively, but NO-dependent relaxation was unchanged in both BHR and SHR versus their respective control group. This study points to genotype-related differences in stress vulnerability in young female rats. The most pronounced negative influence of stress was observed in BHR despite preserved endothelial function.</jats:p>",
        //         "DOI": "10.1155/2014/413629",
        //         "type": "journal-article",
        //         "created": {
        //             "date-parts": [
        //                 [
        //                     2014,
        //                     3,
        //                     9
        //                 ]
        //             ],
        //             "date-time": "2014-03-09T09:21:03Z",
        //             "timestamp": 1394356863000
        //         },
        //         "page": "1-11",
        //         "source": "Crossref",
        //         "is-referenced-by-count": 17,
        //         "title": [
        //             "Genotype-Related Effect of Crowding Stress on Blood Pressure and Vascular Function in Young Female Rats"
        //         ],
        //         "prefix": "10.1155",
        //         "volume": "2014",
        //         "author": [
        //             {
        //                 "ORCID": "http://orcid.org/0000-0001-9757-3283",
        //                 "authenticated-orcid": true,
        //                 "given": "Peter",
        //                 "family": "Slezak",
        //                 "sequence": "first",
        //                 "affiliation": [
        //                     {
        //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
        //                     }
        //                 ]
        //             },
        //             {
        //                 "given": "Angelika",
        //                 "family": "Puzserova",
        //                 "sequence": "additional",
        //                 "affiliation": [
        //                     {
        //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
        //                     }
        //                 ]
        //             },
        //             {
        //                 "given": "Peter",
        //                 "family": "Balis",
        //                 "sequence": "additional",
        //                 "affiliation": [
        //                     {
        //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
        //                     }
        //                 ]
        //             },
        //             {
        //                 "given": "Natalia",
        //                 "family": "Sestakova",
        //                 "sequence": "additional",
        //                 "affiliation": [
        //                     {
        //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
        //                     }
        //                 ]
        //             },
        //             {
        //                 "ORCID": "http://orcid.org/0000-0001-8748-4279",
        //                 "authenticated-orcid": true,
        //                 "given": "Miroslava",
        //                 "family": "Majzunova",
        //                 "sequence": "additional",
        //                 "affiliation": [
        //                     {
        //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
        //                     }
        //                 ]
        //             },
        //             {
        //                 "given": "Ima",
        //                 "family": "Dovinova",
        //                 "sequence": "additional",
        //                 "affiliation": [
        //                     {
        //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
        //                     }
        //                 ]
        //             },
        //             {
        //                 "given": "Michal",
        //                 "family": "Kluknavsky",
        //                 "sequence": "additional",
        //                 "affiliation": [
        //                     {
        //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
        //                     }
        //                 ]
        //             },
        //             {
        //                 "ORCID": "http://orcid.org/0000-0002-6120-706X",
        //                 "authenticated-orcid": true,
        //                 "given": "Iveta",
        //                 "family": "Bernatova",
        //                 "sequence": "additional",
        //                 "affiliation": [
        //                     {
        //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
        //                     }
        //                 ]
        //             }
        //         ],
        //         "member": "98",
        //         "reference": [
        //             {
        //                 "issue": "4",
        //                 "key": "1",
        //                 "doi-asserted-by": "crossref",
        //                 "first-page": "141",
        //                 "DOI": "10.1080/08964280209596039",
        //                 "volume": "27",
        //                 "year": "2002",
        //                 "journal-title": "Behavioral Medicine"
        //             },
        //             {
        //                 "key": "2",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1016/j.brainresbull.2003.12.001"
        //             },
        //             {
        //                 "key": "3",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1016/S0140-6736(04)17019-0"
        //             },
        //             {
        //                 "key": "4",
        //                 "first-page": "1",
        //                 "volume-title": "Introduction to cardiovascular disease, stress and adaptation",
        //                 "year": "2012"
        //             },
        //             {
        //                 "key": "5",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1111/j.1440-1681.2008.04904.x"
        //             },
        //             {
        //                 "key": "6",
        //                 "first-page": "273",
        //                 "volume-title": "The causal role of chronic mental stress in the pathogenesis of essential hypertension",
        //                 "year": "2012"
        //             },
        //             {
        //                 "key": "7",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1186/1471-2458-8-357"
        //             },
        //             {
        //                 "key": "8",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1038/jhh.2008.74"
        //             },
        //             {
        //                 "key": "9",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1007/s10571-011-9768-0"
        //             },
        //             {
        //                 "issue": "4",
        //                 "key": "10",
        //                 "doi-asserted-by": "crossref",
        //                 "first-page": "1227",
        //                 "DOI": "10.1152/physrev.1999.79.4.1227",
        //                 "volume": "79",
        //                 "year": "1999",
        //                 "journal-title": "Physiological Reviews"
        //             },
        //             {
        //                 "key": "11",
        //                 "first-page": "S9",
        //                 "volume": "61",
        //                 "year": "2012",
        //                 "journal-title": "Physiological Research"
        //             },
        //             {
        //                 "key": "12",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1042/CS20050271"
        //             },
        //             {
        //                 "issue": "3",
        //                 "key": "13",
        //                 "first-page": "367",
        //                 "volume": "50",
        //                 "year": "1999",
        //                 "journal-title": "Journal of Physiology and Pharmacology"
        //             },
        //             {
        //                 "issue": "1",
        //                 "key": "14",
        //                 "first-page": "67",
        //                 "volume": "52",
        //                 "year": "2003",
        //                 "journal-title": "Physiological Research"
        //             },
        //             {
        //                 "key": "15",
        //                 "doi-asserted-by": "crossref",
        //                 "first-page": "331",
        //                 "volume": "16",
        //                 "year": "2013",
        //                 "journal-title": "Stress",
        //                 "DOI": "10.3109/10253890.2012.725116"
        //             },
        //             {
        //                 "key": "16",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1023/A:1016627224865"
        //             },
        //             {
        //                 "key": "17",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1007/s00424-011-1022-6"
        //             },
        //             {
        //                 "issue": "5",
        //                 "key": "18",
        //                 "first-page": "667",
        //                 "volume": "56",
        //                 "year": "2007",
        //                 "journal-title": "Physiological Research"
        //             },
        //             {
        //                 "issue": "6",
        //                 "key": "19",
        //                 "doi-asserted-by": "crossref",
        //                 "first-page": "854",
        //                 "DOI": "10.1161/01.HYP.26.6.854",
        //                 "volume": "26",
        //                 "year": "1995",
        //                 "journal-title": "Hypertension"
        //             },
        //             {
        //                 "key": "20",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1080/10253890802234168"
        //             },
        //             {
        //                 "issue": "2",
        //                 "key": "21",
        //                 "first-page": "103",
        //                 "volume": "59",
        //                 "year": "2008",
        //                 "journal-title": "Journal of Physiology and Pharmacology"
        //             },
        //             {
        //                 "key": "22",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1016/j.physbeh.2009.05.011"
        //             },
        //             {
        //                 "key": "23",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1097/01.hjh.0000358834.18311.fc"
        //             },
        //             {
        //                 "key": "24",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1016/S0008-6363(01)00508-9"
        //             },
        //             {
        //                 "key": "25",
        //                 "doi-asserted-by": "crossref",
        //                 "first-page": "897",
        //                 "volume": "2",
        //                 "year": "2010",
        //                 "journal-title": "Health",
        //                 "DOI": "10.4236/health.2010.28133"
        //             },
        //             {
        //                 "key": "26",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1016/j.biopsycho.2004.11.009"
        //             },
        //             {
        //                 "key": "27",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1007/s10517-007-0043-9"
        //             },
        //             {
        //                 "key": "29",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1016/j.niox.2011.12.008"
        //             },
        //             {
        //                 "key": "30",
        //                 "first-page": "73",
        //                 "volume-title": "Measurement of vascular reactive oxygen species production by chemiluminescence",
        //                 "year": "2005"
        //             },
        //             {
        //                 "issue": "4",
        //                 "key": "31",
        //                 "first-page": "405",
        //                 "volume": "13",
        //                 "year": "1995",
        //                 "journal-title": "Journal of Hypertension"
        //             },
        //             {
        //                 "key": "32",
        //                 "doi-asserted-by": "crossref",
        //                 "first-page": "2611",
        //                 "volume": "38",
        //                 "year": "2013",
        //                 "journal-title": "Psychoneuroendocrinology",
        //                 "DOI": "10.1016/j.psyneuen.2013.06.014"
        //             },
        //             {
        //                 "key": "33",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1016/j.appet.2012.02.046"
        //             },
        //             {
        //                 "key": "34",
        //                 "doi-asserted-by": "crossref",
        //                 "first-page": "217",
        //                 "volume": "177",
        //                 "year": "2013",
        //                 "journal-title": "Autonomic Neuroscience",
        //                 "DOI": "10.1016/j.autneu.2013.05.001"
        //             },
        //             {
        //                 "key": "35",
        //                 "doi-asserted-by": "crossref",
        //                 "first-page": "142",
        //                 "volume": "246",
        //                 "year": "2013",
        //                 "journal-title": "Neuroscience",
        //                 "DOI": "10.1016/j.neuroscience.2013.04.052"
        //             },
        //             {
        //                 "key": "36",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1186/1744-9081-7-11"
        //             },
        //             {
        //                 "key": "37",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1113/jphysiol.2007.141580"
        //             },
        //             {
        //                 "key": "38",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1016/j.nlm.2008.07.001"
        //             },
        //             {
        //                 "key": "39",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.3109/10253890.2011.586446"
        //             },
        //             {
        //                 "issue": "3",
        //                 "key": "40",
        //                 "first-page": "487",
        //                 "volume": "58",
        //                 "year": "2007",
        //                 "journal-title": "Journal of Physiology and Pharmacology"
        //             },
        //             {
        //                 "key": "41",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1152/ajpregu.00095.2008"
        //             },
        //             {
        //                 "key": "42",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1113/expphysiol.2010.055970"
        //             },
        //             {
        //                 "issue": "5",
        //                 "key": "43",
        //                 "doi-asserted-by": "crossref",
        //                 "first-page": "R527",
        //                 "DOI": "10.1152/ajpregu.1985.249.5.R527",
        //                 "volume": "249",
        //                 "year": "1985",
        //                 "journal-title": "American Journal of Physiology—Regulatory Integrative and Comparative Physiology"
        //             },
        //             {
        //                 "key": "44",
        //                 "first-page": "111",
        //                 "volume": "116",
        //                 "year": "2002",
        //                 "journal-title": "Indian Journal of Medical Research"
        //             },
        //             {
        //                 "key": "45",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1016/0031-9384(96)00020-0"
        //             },
        //             {
        //                 "key": "46",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1007/s00467-011-1928-4"
        //             },
        //             {
        //                 "key": "47",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1155/2013/427640"
        //             },
        //             {
        //                 "key": "48",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1016/j.jacc.2005.03.068"
        //             },
        //             {
        //                 "key": "49",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1074/jbc.271.39.23928"
        //             },
        //             {
        //                 "key": "50",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1007/s00424-010-0797-1"
        //             },
        //             {
        //                 "key": "51",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1016/j.physbeh.2011.09.017"
        //             },
        //             {
        //                 "key": "52",
        //                 "first-page": "615",
        //                 "volume": "62",
        //                 "year": "2013",
        //                 "journal-title": "Physiological Research"
        //             },
        //             {
        //                 "key": "53",
        //                 "doi-asserted-by": "crossref",
        //                 "first-page": "233",
        //                 "volume": "16",
        //                 "year": "2013",
        //                 "journal-title": "Stress",
        //                 "DOI": "10.3109/10253890.2012.719052"
        //             },
        //             {
        //                 "issue": "1",
        //                 "key": "54",
        //                 "first-page": "53",
        //                 "volume": "46",
        //                 "year": "2009",
        //                 "journal-title": "Indian Journal of Biochemistry and Biophysics"
        //             },
        //             {
        //                 "key": "61",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1161/01.RES.0000082524.34487.31"
        //             },
        //             {
        //                 "key": "55",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1124/pr.59.3.3"
        //             },
        //             {
        //                 "issue": "6",
        //                 "key": "56",
        //                 "doi-asserted-by": "crossref",
        //                 "first-page": "R1719",
        //                 "DOI": "10.1152/ajpregu.2001.280.6.R1719",
        //                 "volume": "280",
        //                 "year": "2001",
        //                 "journal-title": "American Journal of Physiology—Regulatory Integrative and Comparative Physiology"
        //             },
        //             {
        //                 "key": "59"
        //             },
        //             {
        //                 "issue": "4",
        //                 "key": "60",
        //                 "doi-asserted-by": "crossref",
        //                 "first-page": "393",
        //                 "DOI": "10.1161/01.HYP.12.4.393",
        //                 "volume": "12",
        //                 "year": "1988",
        //                 "journal-title": "Hypertension"
        //             },
        //             {
        //                 "key": "57",
        //                 "doi-asserted-by": "crossref",
        //                 "first-page": "341",
        //                 "volume": "78",
        //                 "year": "2013",
        //                 "journal-title": "Steroids",
        //                 "DOI": "10.1016/j.steroids.2012.11.018"
        //             },
        //             {
        //                 "key": "58",
        //                 "doi-asserted-by": "publisher",
        //                 "DOI": "10.1097/00004872-200309000-00019"
        //             }
        //         ],
        //         "container-title": [
        //             "BioMed Research International"
        //         ],
        //         "original-title": [],
        //         "language": "en",
        //         "link": [
        //             {
        //                 "URL": "http://downloads.hindawi.com/journals/bmri/2014/413629.pdf",
        //                 "content-type": "application/pdf",
        //                 "content-version": "vor",
        //                 "intended-application": "text-mining"
        //             },
        //             {
        //                 "URL": "http://downloads.hindawi.com/journals/bmri/2014/413629.xml",
        //                 "content-type": "application/xml",
        //                 "content-version": "vor",
        //                 "intended-application": "text-mining"
        //             },
        //             {
        //                 "URL": "http://downloads.hindawi.com/journals/bmri/2014/413629.pdf",
        //                 "content-type": "unspecified",
        //                 "content-version": "vor",
        //                 "intended-application": "similarity-checking"
        //             }
        //         ],
        //         "deposited": {
        //             "date-parts": [
        //                 [
        //                     2019,
        //                     8,
        //                     8
        //                 ]
        //             ],
        //             "date-time": "2019-08-08T08:38:00Z",
        //             "timestamp": 1565253480000
        //         },
        //         "score": 1,
        //         "resource": {
        //             "primary": {
        //                 "URL": "http://www.hindawi.com/journals/bmri/2014/413629/"
        //             }
        //         },
        //         "subtitle": [],
        //         "short-title": [],
        //         "issued": {
        //             "date-parts": [
        //                 [
        //                     2014
        //                 ]
        //             ]
        //         },
        //         "references-count": 60,
        //         "alternative-id": [
        //             "413629",
        //             "413629"
        //         ],
        //         "URL": "http://dx.doi.org/10.1155/2014/413629",
        //         "relation": {},
        //         "ISSN": [
        //             "2314-6133",
        //             "2314-6141"
        //         ],
        //         "issn-type": [
        //             {
        //                 "value": "2314-6133",
        //                 "type": "print"
        //             },
        //             {
        //                 "value": "2314-6141",
        //                 "type": "electronic"
        //             }
        //         ],
        //         "subject": [
        //             "General Immunology and Microbiology",
        //             "General Biochemistry, Genetics and Molecular Biology",
        //             "General Medicine"
        //         ],
        //         "published": {
        //             "date-parts": [
        //                 [
        //                     2014
        //                 ]
        //             ]
        //         }
        //     }
        // }
    }
    async function getNodesAndLinksFor(paperOrDoi, limit=150) {
        const getPaperInfoWrapper = (...args)=>{
            if (limit<=0) {
                return "hitLimit"
            } else {
                limit-=1
                return getPaperInfo(...args)
            }
        }
        const paperInfo = await getPaperInfoWrapper(paperOrDoi, { showError: true })
        if (!paperInfo) {
            return { nodes: [ { id: 0, yearCreated: "Sorry :/", authorLastName: "(not in database)" } ], links: [] }
        }
        
        paperInfo.title = `${paperInfo.title}`||Object.keys(paperInfo).filter(each=>each.match(/.*\btitle\b.*/)).filter(each=>!each.match(/.*\bshort\b.*/)).map(each=>paperInfo[each]).filter(each=>`${each}`)[0]
        try {
            paperInfo.yearCreated = paperInfo.created["date-parts"][0][0]
        } catch (error) {}
        paperInfo.yearCreated = paperInfo.yearCreated || "[YearCreated Unknown]"
        paperInfo.authorLastName = (paperInfo?.author?.length>0 ? paperInfo.author[0].family : "") || "[LastName Unknown]"
        activeNode = paperInfo
        renderNodeSummary(paperInfo)
        const dois = (paperInfo?.reference||[]).map(each=>each.DOI).filter(each=>each).slice(0,limit)
        if (dois.length == 0) {
            showToast(`Note: the paper is in the database, but I don't see any related references`, {duration: 9000})
        }
        let relatedPapers = await Promise.all(
            dois.map(each=>getPaperInfoWrapper(each))
        )
        limit -= relatedPapers.length
        const relatedRelatedPapers = await Promise.all(
            relatedPapers.map(eachPaper=>
                (eachPaper?.reference||[]).map(each=>each.DOI).filter(each=>each)
            ).flat(Infinity).filter(eachDoi=>!dois.includes(eachDoi)).map(
                eachDoi=>getPaperInfoWrapper(eachDoi)
            )
        )
        relatedPapers = relatedPapers.concat(relatedRelatedPapers)
        relatedPapers = relatedPapers.filter(each=>each!="hitLimit")
        console.debug(`relatedPapers.length is:`,relatedPapers.length)
        const papers = Object.fromEntries(zip(dois, relatedPapers))
        papers[paperInfo.DOI] = paperInfo
        // NOTE: some references don't have a DOI
        // "key": "4",
        // "first-page": "1",
        // "volume-title": "Introduction to cardiovascular disease, stress and adaptation",
        // "year": "2012"
        const nodesById = {}
        const papersWithoutInfo = []
        for (const [eachDoi, eachPaper] of Object.entries(papers)) {
            if (!eachPaper) {
                papersWithoutInfo.push(eachDoi)
                continue
            }
            eachPaper.DOI = eachDoi
            let yearCreated = ""
            try {
                yearCreated = eachPaper.created["date-parts"][0][0]
            } catch (error) {
                
            }
            const node = {
                id: eachPaper.DOI || `${Math.random()}`,
                DOI: eachPaper.DOI,
                title: (eachPaper.title||Object.keys(eachPaper).filter(each=>each.match(/.*\btitle\b.*/)).map(each=>eachPaper[each]).filter(each=>each)[0]),
                authorLastName: (eachPaper?.author?.length>0 ? eachPaper.author[0].family : ""),
                yearCreated,
                citedBy: [
                ],
                cited: (eachPaper.reference||[]).map(each=>each.DOI).filter(each=>each),
            }
            if (node.title instanceof Array) {
                node.title = `${node.title}`
            }
            nodesById[node.id] = node
        }
        console.debug(`Object.values(nodesById).length is:`,Object.values(nodesById).length)
        removeAllChildElements(infoArea)
        if (papersWithoutInfo.length > 0) {
            infoArea.appendChild(html`
                <Container>
                    <h5 style="font-size: 12pt; margin-top: 1rem;">Note: the database didn't have info on the following related paper(s)</h5>
                    <ul style="max-height: 10rem; overflow: auto; color: gray;">
                        ${papersWithoutInfo.map(each=>html`<li><a href=${`https://doi.org/${each}`}>${each}</a></li>`)}
                    </ul>
                </Container>
            `)
            previewInfoContainer.appendChild(infoArea)
        }
        const links = []
        for (const [eachId, eachNode] of Object.entries(nodesById)) {
            for (const eachDoi of eachNode.cited) {
                const otherNode = nodesById[eachDoi]
                if (otherNode) {
                    otherNode.citedBy.push(eachNode.id)
                    links.push({
                        sourceTitle: otherNode.title,
                        source: otherNode.id,
                        targetTitle: eachNode.title,
                        target: eachId,
                    })
                }
            }
        }
        return {nodes: Object.values(nodesById), links}
    }
    const loadNewGraph = ({nodes, links})=>{
        const newGraph = html`
                <Graph
                    nodes=${nodes}
                    links=${links}
                    style="background: ${theme.farBackground}; width: 100%; color: ${theme.foregroundBright}"
                    onNodeClick=${(node)=>{
                        activeNode = node
                        renderNodeSummary(activeNode)
                    }}
                    >
                </Graph>
            `
        graphContainer.replaceChild(
            newGraph,
            graphContainer.children[0],
        )
    }
// 
// 
// Components
// 
// 
    function Space() {
        const element = document.createElement("code")
        element.style.whiteSpace = "pre"
        element.style.minWidth = "0.3em"
        return element
    }
    
    /**
     * create graph
     *
     * @example
     * ```js
     * const nodes = [{ id: 'node1' }, { id: 'node2' }, { id: 'node3' }]
     * const links = [{ source: 'node1', target: 'node2' }, { source: 'node2', target: 'node3' }, { source: 'node3', target: 'node1' }]
     * ```
     *
     * @param arg1 - description
     * @param arg1.parameter - description
     * @returns {Object} output - description
     * @returns output.x - description
     *
     */
    function Graph({nodes, links, style={}, nodeSize=18, nodeColor=theme.accent, minZoom=0.2, maxZoom=3, onNodeClick, labelAnchor="left", labelSize="10pt", }) {
        try {
            const graph = html`<div></div>`
            graph.style.display = "flexbox"
            graph.style.alignItems = "center"
            graph.style.alignContent = "center"
            graph.style.overflow = "hidden"
            const givenStyles = (html`<div style=${style}></div>`).style
            for (const key of Object.values(givenStyles)) {
                graph.style[key] = givenStyles[key]
            }
            // Object.assign(graph.style, (html`<div style=${style}></div>`).style)
            const height = window.screen.height
            const width = window.screen.width
            // const element = html`<svg height=${height} width=${width}></svg>`
            const element = html`<svg viewBox="600 -500 2000 2000" height=${height} width=${width}></svg>`
            const svg = d3.select(element)
            const nodeDataById = {}
            for (let each of nodes) {
                nodeDataById[each.id] = each
            }
            
            // add Zooming and panning
            const container = svg.append("g");
            svg.call(
                d3.zoom()
                    .scaleExtent([ minZoom, maxZoom ]) // Set the minimum and maximum zoom levels
                    .on("zoom", ()=>container.attr("transform", d3.event.transform))
            )

            const link = container.append("g")
                .selectAll("line")
                .data(links)
                .enter().append("line")

            link
                .style("stroke", "#aaaaaa50")
                .style("stroke-width", "4px")
            
            const years = nodes.map(each=>each.yearCreated).filter(each=>each)
            const largestYear = Math.max(...years)
            const smallestYear = Math.min(...years)
            const yearRange = largestYear-smallestYear
            const normalizer = (year)=>{
                const normlized = ((year-smallestYear)/yearRange)
                if (normlized==normlized) {
                    return normlized
                } else {
                    return 1
                }
            }
                
            const node = container.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                //I made the article/source nodes larger than the entity nodes
                .attr("r", each=>{
                    if (each.size != null) {
                        return each.size
                    } else {
                        const normlizedNumber = normalizer(each.yearCreated)
                        return nodeSize+(35*Math.pow(normalizer(each.yearCreated),1.7))-5
                    }
                }) 
                .attr("id", each=>each.id)
            
            if (onNodeClick) {
                node.on("click", onNodeClick)
            }
            node.on("mouseover", (each)=>renderNodeSummary(each,{withTempColoring:true}))
            node.on("mouseout", ()=>activeNode&&renderNodeSummary(activeNode))
            
            
            for (const each of element.querySelectorAll("circle")) {
                nodeDataById[each.id].element = each
            }
            
            
            node
                .style("fill", nodeColor)
                .style("fill-opacity","1")
                .style("stroke", "#00000000")
                .style("stroke-width", "0px")
            
            const label = container.append("g")
                .attr("class", "labels")
                .selectAll("text")
                .data(nodes)
                .enter().append("text")
                .text(each=>{
                    return each.authorLastName||each.yearCreated? `${each.authorLastName||"?"}, ${each.yearCreated||"?"}`:""
                })
                .attr("class", "label")

            label
                .style("text-anchor", labelAnchor)
                .style("font-size", labelSize)
                .style("fill", theme.foregroundBright)
            
            const simulation = d3.forceSimulation(nodes)
            simulation.force('link', d3.forceLink(links).id(d => d.id))
            simulation.force('charge', d3.forceManyBody().strength(-4000))  // Increase strength to add padding
            simulation.force('center', d3.forceCenter(width/2, height/2))
            
            simulation.on('tick', () => {
                link
                    .attr("x1", (d)=>d.source.x-1)
                    .attr("y1", (d)=>d.source.y-1)
                    .attr("x2", (d)=>d.target.x-1)
                    .attr("y2", (d)=>d.target.y-1)

                node
                    .attr("cx", (d)=>d.x+5)
                    .attr("cy", (d)=>d.y-3)

                label
                    .attr("x",
                        (d,index,labels)=>{
                            const label = labels[index]
                            // const element = nodeDataById[d.id].element
                            // const nodeRadius = element.getAttribute("r")-0
                            // const nodeStrokeWidth = getComputedStyle(element).strokeWidth.slice(0,-(("px").length))-0
                            // // for whatever reason, visually this is always off by "3"
                            // // which is why 3 is added here
                            // return nodeRadius + nodeStrokeWidth + 3 + d.x
                            const {left,right} = label.getBoundingClientRect()
                            window.label = label
                            window.d = d
                            return d.x - (Math.abs(left-right)/2)
                        }
                    )
                    .attr("y",
                        (d)=>{
                            const element = nodeDataById[d.id].element
                            const nodeRadius = element.getAttribute("r")-0
                            const nodeStrokeWidth = getComputedStyle(element).strokeWidth.slice(0,-(("px").length))-0
                            // for whatever reason, visually this is always off by "3"
                            // which is why 3 is added here
                            return d.y - (nodeRadius + nodeStrokeWidth + 3)
                        }
                    )
            })
            
            graph.appendChild(element)
            return graph
        } catch (error) {
            console.debug(`error is:`,error)
            console.log(error.stack)
            return html`<span>Error ${error}</span>`
        }
    }

    function Title({underline, thin, size, style, children, color, ...props}) {
        style = {
            flexGrow: 0,
            fontSize: size||"1.5em",
            marginBottom: "0.7em",
            // add underline or not
            ...(underline ? {
                borderBottom: "2px solid "+(color||"gray"),
                fontSize: size||"1.3em",
            }:{}),
            ...(thin ? {
                fontWeight: 100,
            }:{}),
            ...(thin && underline ? {
                borderBottom: "1px solid "+(color||"gray"),
            }:{}),
            color,
            ...style,
            ...props,
        }
        const element = html`
            <h4 ...${props} >
                    ${children}
            </h4>
        `
        // this next line shouldn't be necessary, I'm not sure why it is (but I know that it is)
        Object.assign(element.style, style)
        return element
    }
    
    function LinePadding() {
        return html`<Container class="line-padding" min-height=0.4em />`
    }
    
    function Card({name, children, ...props}) {
        return html`
            <Container
                name=${name}
                border-radius="1em"
                box-shadow="0 4px 5px 0 rgba(0,0,0,0.10),0 1px 10px 0 rgba(0,0,0,0.08),0 2px 4px -1px rgba(0,0,0,0.24)"
                padding="1.5em 2em"
                background="var(--card-background, white)"
                ...${props}
                >
                    ${children}
            </Container>
        `
    }
    
    function Chip({name, color, children, ...props}) {
        return html`
            <Container
                name=${name}
                border-radius="2em"
                padding="0.35em 0.7em"
                margin="0.15em"
                background=${color||"rgba(255,255,255,0.25)"}
                backdrop-filter=${color?"":"saturate(180%) brightness(1.05)"}
                color="white"
                font-size="0.8em"
                display="inline-block"
                max-width="max-content"
                min-width="max-content"
                cursor="default"
                ...${props}
                >
                    ${children}
            </Container>
        `
    }
    
    function AcheivementToken({children, ...props}) {
        return html`
            <Container
                border-radius="2em"
                border="2px solid white"
                box-shadow="0 4px 5px 0 rgba(0,0,0,0.10),0 1px 10px 0 rgba(0,0,0,0.08),0 2px 4px -1px rgba(0,0,0,0.24)"
                margin-bottom="1em"
                ...${props}
                > 
                    <Container
                        border-radius="2em"
                        border="5px solid #E5C07B"
                        padding="0.6em 1em"
                        font-size="1em"
                        background-color="white"
                        row
                        > 
                            ${children}
                    </Container>
            </Container>
        `
    }