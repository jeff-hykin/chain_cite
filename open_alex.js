#!/usr/bin/env -S deno run --allow-all
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.13.5.0/array.js"
import { deepCopy, deepCopySymbol, allKeyDescriptions, allKeys } from "https://deno.land/x/good@1.13.5.0/value.js"
import DateTime from "https://deno.land/x/good@1.13.5.0/date.js"
// import { Parser, parserFromWasm } from "https://deno.land/x/deno_tree_sitter@0.1.3.0/main.js"
// import html from "https://github.com/jeff-hykin/common_tree_sitter_languages/raw/4d8a6d34d7f6263ff570f333cdcf5ded6be89e3d/main/html.js"
import { toCamelCase } from "https://deno.land/x/good@1.13.5.0/flattened/to_camel_case.js"

const jsonFetch = async (url, options)=>{
    const response = await fetch(url, options)
    if (response.ok) {
        const text = await response.text()
        try {
            return JSON.parse(text)
        } catch (error) {
            console.debug(`fetch couldn't parse as JSON:`,text)
        }
    } else {
        throw Error(`when fetching ${url} I got an error response: ${response.statusText}`, response)
    }
}

export function openAlexToSimpleFormat(each) {
    //     topics: [
    //         { id: "https://openalex.org/T10653", display_name: "Robot Manipulation and Learning", score: 0.9985, subfield: { id: "https://openalex.org/subfields/2207", display_name: "Control and Systems Engineering" }, field: { id: "https://openalex.org/fields/22", display_name: "Engineering" }, domain: { id: "https://openalex.org/domains/3", display_name: "Physical Sciences" } },
    //         { id: "https://openalex.org/T10531", display_name: "Advanced Vision and Imaging", score: 0.9978, subfield: { id: "https://openalex.org/subfields/1707", display_name: "Computer Vision and Pattern Recognition" }, field: { id: "https://openalex.org/fields/17", display_name: "Computer Science" }, domain: { id: "https://openalex.org/domains/3", display_name: "Physical Sciences" } },
    //         { id: "https://openalex.org/T12549", display_name: "Image and Object Detection Techniques", score: 0.9897, subfield: { id: "https://openalex.org/subfields/1707", display_name: "Computer Vision and Pattern Recognition" }, field: { id: "https://openalex.org/fields/17", display_name: "Computer Science" }, domain: { id: "https://openalex.org/domains/3", display_name: "Physical Sciences" } },
    //     ],
    //     keywords: [{ id: "https://openalex.org/keywords/affordance", display_name: "Affordance", score: 0.94692224 }],
    //     concepts: [
    //         { id: "https://openalex.org/C194995250", wikidata: "https://www.wikidata.org/wiki/Q531136", display_name: "Affordance", level: 2, score: 0.94692224 },
    //         { id: "https://openalex.org/C41008148", wikidata: "https://www.wikidata.org/wiki/Q21198", display_name: "Computer science", level: 0, score: 0.6867339 },
    //         { id: "https://openalex.org/C90509273", wikidata: "https://www.wikidata.org/wiki/Q11012", display_name: "Robot", level: 2, score: 0.6247663 },
    //         { id: "https://openalex.org/C107457646", wikidata: "https://www.wikidata.org/wiki/Q207434", display_name: "Human–computer interaction", level: 1, score: 0.59470433 },
    //         { id: "https://openalex.org/C154945302", wikidata: "https://www.wikidata.org/wiki/Q11660", display_name: "Artificial intelligence", level: 1, score: 0.49061385 },
    //     ],
    return {
        DOI: each.doi,
        title: each.title,
        abstract: each.abstract,
        concepts: [...new Set([ 
            ...(each.topics||[]).map(each=>each.display_name),
            ...(each.topics||[]).map(each=>each?.subfield?.display_name),
            ...(each.keywords||[]).map(each=>each.display_name),
            ...(each.concepts||[]).map(each=>each.display_name) 
        ].filter(each=>each).map(each=>each.toLowerCase()))],
        year: each.publication_year || each.created_date,
        authorNames: (each.authorships||[]).map(each=>each.author.display_name),
        link: each?.primary_location?.landing_page_url || (each.locations||[]).map(each=>each.landing_page_url).filter(each=>each)[0],
        pdfLink: each?.primary_location?.pdf_url || (each.locations||[]).map(each=>each.pdf_url).filter(each=>each)[0],
        citationCount: (each.counts_by_year||[]).map(each=>each.cited_by_count).reduce((a,b)=>(a-0)+(b-0),0),
        citedAlexIds: each.referenced_works,
        relatedAlexIds: each.related_works,
        openAlexId: each.id.replace("https://openalex.org/",""),
    }
}

/**
 * this exists mostly for caching
 */
export async function getOpenAlexData(urlOrDoi, {cacheObject, onUpdateCache=_=>0,}={}) {
    cacheObject = cacheObject||getOpenAlexData.cache
    urlOrDoi = urlOrDoi.replace("https://openalex.org","https://api.openalex.org")
    if (!urlOrDoi.startsWith("https://api.openalex.org") && !urlOrDoi.startsWith("https://doi.org/")) {
        urlOrDoi = `https://api.openalex.org/works/https://doi.org/${urlOrDoi}`
    }
    if (!cacheObject[urlOrDoi]) {
        let needToWait
        do {
            // avoid hitting rate limit
            const thresholdTime = getOpenAlexData.lastFetchTime.getTime() + getOpenAlexData.waitTime
            const now = new Date().getTime()
            needToWait = thresholdTime - now
            if (needToWait > 0) {
                await new Promise(r=>setTimeout(r, needToWait))
            }
        } while (needToWait > 0)
        getOpenAlexData.lastFetchTime = new Date()
        const result = await fetch(urlOrDoi)
        if (result.ok) {
            let output = (await result.json())
            if (output instanceof Object) {
                cacheObject[urlOrDoi] = output
                await onUpdateCache(urlOrDoi)
            }
        } else {
            throw Error(`when fetching ${urlOrDoi} I got an error response ${result.statusText}`, result)
        }
    }
    return cacheObject[urlOrDoi]
}
getOpenAlexData.cache = {}
getOpenAlexData.lastFetchTime = new Date()
getOpenAlexData.waitTime = 2000

/**
 * @example
 * ```js
 * console.log(Object.keys((await getRelatedArticles({ doi: "10.1109/icra48891.2023.10161288" })).relatedArticles))
 * ```
 */
export async function getRelatedArticles(reference, onProgress) {
    onProgress = onProgress||(function(){})
    const doi = reference?.DOI || reference?.doi || reference
    if (!(typeof doi == "string")) {
        console.warn(`no doi for reference`, reference)
        return {}
    }
    const relatedArticles = {}
    const openAlexData = reference.related_works ? reference : (await getOpenAlexData(`https://api.openalex.org/works/https://doi.org/${doi}`))
    const relatedIds = ((openAlexData.related_works||openAlexData.relatedAlexIds)||[]).concat((openAlexData.referenced_works||openAlexData.citedAlexIds)||[])
    const handleEach = async (each)=>{
        return await getOpenAlexData(each).then(each=>{
            return relatedArticles[each.title] = openAlexToSimpleFormat(each)
        })
    }
    // cant use Promise.all because of throttling
    let rateLimit = 0
    let index = -1
    for (let each of relatedIds) {
        index++
        let eachResult
        try {
            eachResult = await handleEach(each)
        } catch (error) {
            if (error.message.match(/Too Many Requests/i)) {
                console.warn(`rate limit error when getting ${each.doi} from openAlex\n slowing down request`)
                rateLimit += 1000
                await new Promise(resolve=>setTimeout(resolve,rateLimit))
                try {
                    await handleEach(each)
                } catch (error) {
                    console.debug(`error is:`,error)
                    console.warn(`still unable to get ${each.doi} from openAlex\nprobably need to try again later`)
                    break
                }
            }
        }
        onProgress(index+1,relatedIds.length, eachResult)
    }
    return relatedArticles
}