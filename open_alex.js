#!/usr/bin/env -S deno run --allow-all
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.13.5.0/array.js"
import { deepCopy, deepCopySymbol, allKeyDescriptions, allKeys } from "https://deno.land/x/good@1.13.5.0/value.js"
import DateTime from "https://deno.land/x/good@1.13.5.0/date.js"
// import { Parser, parserFromWasm } from "https://deno.land/x/deno_tree_sitter@0.1.3.0/main.js"
// import html from "https://github.com/jeff-hykin/common_tree_sitter_languages/raw/4d8a6d34d7f6263ff570f333cdcf5ded6be89e3d/main/html.js"
import { toCamelCase } from "https://deno.land/x/good@1.13.5.0/flattened/to_camel_case.js"
import { createCachedJsonFetcher } from "./fetch_tools.js"

export const openAlexFetch = createCachedJsonFetcher({
    rateLimit: 1000, // according to their website openAlex rate limit is once per second, and 1000 per day
    urlNormalizer=url=>url.replace("https://openalex.org","https://api.openalex.org"),
}) 

export function openAlexDataFromDoi(doi) {
    // {
    //     id: "https://openalex.org/W4383108856",
    //     doi: "https://doi.org/10.1109/icra48891.2023.10161288",
    //     title: "Visual Affordance Prediction for Guiding Robot Exploration",
    //     display_name: "Visual Affordance Prediction for Guiding Robot Exploration",
    //     publication_year: 2023,
    //     publication_date: "2023-05-29",
    //     ids: { openalex: "https://openalex.org/W4383108856", doi: "https://doi.org/10.1109/icra48891.2023.10161288" },
    //     language: "en",
    //     primary_location: { is_oa: false, landing_page_url: "https://doi.org/10.1109/icra48891.2023.10161288", pdf_url: null, source: null, license: null, license_id: null, version: null, is_accepted: false, is_published: false },
    //     type: "article",
    //     type_crossref: "proceedings-article",
    //     indexed_in: ["crossref"],
    //     open_access: { is_oa: true, oa_status: "green", oa_url: "https://arxiv.org/pdf/2305.17783", any_repository_has_fulltext: true },
    //     authorships: [
    //         { author_position: "first", author: { id: "https://openalex.org/A5064794691", display_name: "Homanga Bharadhwaj", orcid: "https://orcid.org/0000-0001-5056-8516" }, institutions: [{ id: "https://openalex.org/I74973139", display_name: "Carnegie Mellon University", ror: "https://ror.org/05x2bcf33", country_code: "US", type: "education", lineage: [Array] }], countries: ["US"], is_corresponding: false, raw_author_name: "Homanga Bharadhwaj", raw_affiliation_strings: ["Robotics Institute, Carnegie Mellon University"], affiliations: [{ raw_affiliation_string: "Robotics Institute, Carnegie Mellon University", institution_ids: [Array] }] },
    //         { author_position: "middle", author: { id: "https://openalex.org/A5101761266", display_name: "Abhinav Gupta", orcid: "https://orcid.org/0000-0002-3646-2421" }, institutions: [{ id: "https://openalex.org/I74973139", display_name: "Carnegie Mellon University", ror: "https://ror.org/05x2bcf33", country_code: "US", type: "education", lineage: [Array] }], countries: ["US"], is_corresponding: false, raw_author_name: "Abhinav Gupta", raw_affiliation_strings: ["Robotics Institute, Carnegie Mellon University"], affiliations: [{ raw_affiliation_string: "Robotics Institute, Carnegie Mellon University", institution_ids: [Array] }] },
    //         { author_position: "last", author: { id: "https://openalex.org/A5029932788", display_name: "Shubham Tulsiani", orcid: "https://orcid.org/0000-0001-5651-9424" }, institutions: [{ id: "https://openalex.org/I74973139", display_name: "Carnegie Mellon University", ror: "https://ror.org/05x2bcf33", country_code: "US", type: "education", lineage: [Array] }], countries: ["US"], is_corresponding: false, raw_author_name: "Shubham Tulsiani", raw_affiliation_strings: ["Robotics Institute, Carnegie Mellon University"], affiliations: [{ raw_affiliation_string: "Robotics Institute, Carnegie Mellon University", institution_ids: [Array] }] },
    //     ],
    //     institution_assertions: [],
    //     countries_distinct_count: 1,
    //     institutions_distinct_count: 1,
    //     corresponding_author_ids: [],
    //     corresponding_institution_ids: [],
    //     apc_list: null,
    //     apc_paid: null,
    //     fwci: 3.366,
    //     has_fulltext: false,
    //     cited_by_count: 8,
    //     citation_normalized_percentile: { value: 0.620722, is_in_top_1_percent: false, is_in_top_10_percent: false },
    //     cited_by_percentile_year: { min: 94, max: 95 },
    //     biblio: { volume: null, issue: null, first_page: "3029", last_page: "3036" },
    //     is_retracted: false,
    //     is_paratext: false,
    //     primary_topic: { id: "https://openalex.org/T10653", display_name: "Robot Manipulation and Learning", score: 0.9985, subfield: { id: "https://openalex.org/subfields/2207", display_name: "Control and Systems Engineering" }, field: { id: "https://openalex.org/fields/22", display_name: "Engineering" }, domain: { id: "https://openalex.org/domains/3", display_name: "Physical Sciences" } },
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
    //     mesh: [],
    //     locations_count: 2,
    //     locations: [
    //         { is_oa: false, landing_page_url: "https://doi.org/10.1109/icra48891.2023.10161288", pdf_url: null, source: null, license: null, license_id: null, version: null, is_accepted: false, is_published: false },
    //         { is_oa: true, landing_page_url: "https://arxiv.org/abs/2305.17783", pdf_url: "https://arxiv.org/pdf/2305.17783", source: { id: "https://openalex.org/S4306400194", display_name: "arXiv (Cornell University)", issn_l: null, issn: null, is_oa: true, is_in_doaj: false, is_core: false, host_organization: "https://openalex.org/I205783295", host_organization_name: "Cornell University", host_organization_lineage: ["https://openalex.org/I205783295"], host_organization_lineage_names: ["Cornell University"], type: "repository" }, license: null, license_id: null, version: "submittedVersion", is_accepted: false, is_published: false },
    //     ],
    //     best_oa_location: { is_oa: true, landing_page_url: "https://arxiv.org/abs/2305.17783", pdf_url: "https://arxiv.org/pdf/2305.17783", source: { id: "https://openalex.org/S4306400194", display_name: "arXiv (Cornell University)", issn_l: null, issn: null, is_oa: true, is_in_doaj: false, is_core: false, host_organization: "https://openalex.org/I205783295", host_organization_name: "Cornell University", host_organization_lineage: ["https://openalex.org/I205783295"], host_organization_lineage_names: ["Cornell University"], type: "repository" }, license: null, license_id: null, version: "submittedVersion", is_accepted: false, is_published: false },
    //     sustainable_development_goals: [],
    //     grants: [],
    //     datasets: [],
    //     versions: [],
    //     referenced_works_count: 43,
    //     referenced_works: ["https://openalex.org/W1524842461", "https://openalex.org/W1933657216", "https://openalex.org/W1960578971", "https://openalex.org/W2032293070", "https://openalex.org/W2188365844", "https://openalex.org/W2201912979", "https://openalex.org/W2612034718", "https://openalex.org/W2625366777", "https://openalex.org/W2823112946", "https://openalex.org/W2895453875", "https://openalex.org/W2908390575", "https://openalex.org/W2952716587", "https://openalex.org/W2953469440", "https://openalex.org/W2962770929", "https://openalex.org/W2962785568", "https://openalex.org/W2962793481", "https://openalex.org/W2962793652", "https://openalex.org/W2963049618", "https://openalex.org/W2963073614", "https://openalex.org/W2963523627", "https://openalex.org/W2963799213", "https://openalex.org/W2964067469", "https://openalex.org/W2980216391", "https://openalex.org/W2983465317", "https://openalex.org/W3003651690", "https://openalex.org/W3006227479", "https://openalex.org/W3032077725", "https://openalex.org/W3034445277", "https://openalex.org/W3035574324", "https://openalex.org/W3035622854", "https://openalex.org/W3035717769", "https://openalex.org/W3089793705", "https://openalex.org/W3104898494", "https://openalex.org/W3120441392", "https://openalex.org/W3180355996", "https://openalex.org/W3207837114", "https://openalex.org/W3207908209", "https://openalex.org/W4287251598", "https://openalex.org/W4287686848", "https://openalex.org/W4287994983", "https://openalex.org/W4288349972", "https://openalex.org/W4300799055", "https://openalex.org/W4301206121"],
    //     related_works: ["https://openalex.org/W4391375266", "https://openalex.org/W3089455568", "https://openalex.org/W3049116993", "https://openalex.org/W2899084033", "https://openalex.org/W2748952813", "https://openalex.org/W2417026147", "https://openalex.org/W2346831895", "https://openalex.org/W2248634132", "https://openalex.org/W1972718289", "https://openalex.org/W1791514435"],
    //     abstract_inverted_index: { Motivated: [0], by: [1], the: [2, 8, 14, 66, 85, 105, 115, 120, 125, 130], intuitive: [3], understanding: [4, 22], humans: [5], have: [6], about: [7], space: [9, 67], of: [10, 39, 68, 124], possible: [11], "interactions,": [12], and: [13, 74, 99, 103, 122, 127], ease: [15], with: [16, 56, 71], which: [17], they: [18], can: [19, 51, 94, 134], generalize: [20], this: [21], to: [23, 79, 111], previously: [24], unseen: [25], "scenes,": [26], we: [27, 42, 64], develop: [28], an: [29, 36], approach: [30], for: [31, 137], learning: [32, 144], "'visual": [33], "affordances'.": [34], Given: [35], input: [37], image: [38], a: [40, 44, 72, 76, 81], "scene,": [41], infer: [43], distribution: [45, 83], over: [46], plausible: [47, 62], future: [48], states: [49], that: [50, 91, 104], be: [52, 95, 135], achieved: [53], via: [54], interactions: [55], "it.": [57], To: [58], allow: [59], predicting: [60], diverse: [61, 100, 112], "futures,": [63], discretize: [65], continuous: [69], images: [70], "VQ-VAE": [73], use: [75], "Transformer-based": [77], model: [78, 133], learn: [80], conditional: [82], in: [84, 145], latent: [86], embedding: [87], "space.": [88], We: [89, 118], show: [90], these: [92], models: [93, 107], trained: [96, 131], using: [97], "large-scale": [98], passive: [101], "data,": [102], learned: [106], exhibit: [108], compositional: [109], generalization: [110], objects: [113], beyond: [114], training: [116], "distribution.": [117], evaluate: [119], quality: [121], diversity: [123], "generations,": [126], demonstrate: [128], how: [129], affordance: [132], used: [136], guiding: [138], exploration: [139], during: [140], visual: [141], "goal-conditioned": [142], policy: [143], robotic: [146], "manipulation.": [147] },
    //     cited_by_api_url: "https://api.openalex.org/works?filter=cites:W4383108856",
    //     counts_by_year: [{ year: 2024, cited_by_count: 8 }],
    //     updated_date: "2024-12-13T13:55:24.466451",
    //     created_date: "2023-07-05",
    // }
    return openAlexFetch(`https://api.openalex.org/works/https://doi.org/${doi}`)
}

export async function getLinkedOpenAlexArticles(openAlexId) {
    if (!(typeof openAlexId == "string")) {
        console.warn(`getLinkedOpenAlexArticles(openAlexId), openAlexId arg was not a string`, openAlexId)
        return {}
    }
    return {
        citedBy: await openAlexFetch(`https://api.openalex.org/works?filter=cited_by:${openAlexId}`),
        cites: await openAlexFetch(`https://api.openalex.org/works?filter=cites:${openAlexId}`),
    }
}