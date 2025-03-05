activeNode = paperInfo
renderNodeSummary(paperInfo)

async function getNodesAndLinksFor(paper, limit=150) {
    const paperInfo = {
        title: paper.title||"[Title Unknown]",
        year: paper.year||paper.year||"[Year Unknown]",
        authorLastName: paper.authorLastName||"[LastName Unknown]",
        doi: paper.doi,
        id: paper.doi || `${Math.random()}`,
    }

    let connectedPapers = await paper.getConnectedPapers()
    // fit them under the limit
    connectedPapers = connectedPapers.filter(each=>each?.doi).sort((a,b)=>b.year-a.year).sort((a,b)=>b.citationCount-a.citationCount).slice(0,limit)
    if (connectedPapers.length == 0) {
        return { 
            nodes: [
                {
                    id: 0,
                    year: "Sorry :/",
                    authorLastName: "(not in database)" 
                }
            ],
            links: [],
        }
    }
    papers[paperInfo.doi] = paper
    
    const papersWithoutInfo = []
    const nodesById = {}
    // get rid of duplicate entries (based on doi)
    const papers = Object.fromEntries(zip(connectedPapers.map(each=>each.doi), connectedPapers))
    for (const eachPaper of Object.values(papers)) {
        const node = {
            id: eachPaper.doi,
            doi: eachPaper.doi,
            title: eachPaper.title,
            authorLastName: eachPaper.authorNames.at(-1),
            year: eachPaper.year,
            citedBy: eachPaper.citedBy,
            cited: eachPaper.cites,
        }
        nodesById[node.id] = node
    }

    // removeAllChildElements(infoArea)
    // if (papersWithoutInfo.length > 0) {
    //     infoArea.appendChild(html`
    //         <Container>
    //             <h5 style="font-size: 12pt; margin-top: 1rem;">Note: the database didn't have info on the following related paper(s)</h5>
    //             <ul style="max-height: 10rem; overflow: auto; color: gray;">
    //                 ${papersWithoutInfo.map(each=>html`<li><a href=${`https://doi.org/${each}`}>${each}</a></li>`)}
    //             </ul>
    //         </Container>
    //     `)
    //     previewInfoContainer.appendChild(infoArea)
    // }
    
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