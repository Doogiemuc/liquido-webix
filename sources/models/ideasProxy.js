/**
 * Proxy that loads ideas from the backend
 * Handles paging and sorting.
 */

const ideasUrl = "http://localhost:8080/liquido/v2/laws/search/findByStatus?status=IDEA"

/*
 * https://webix.com/snippet/8fd8d824
 * https://docs.webix.com/desktop__server_customload.html
 * https://docs.webix.com/desktop__plain_dynamic_loading.html#serversideresponse
 *  Spring Data Rest interface:
 * https://docs.spring.io/spring-data/rest/docs/current/reference/html/#paging-and-sorting.sorting
 */
export default ideasProxy = {
	$proxy:true,
	load:function(view, callback, params) {
		var url = ideasUrl
		params = webix.extend(params||{}, this.params||{}, true);
    if(params && params.start !== undefined && params.count !== undefined) {   
		  //Webix params:
		  //  params.start - number of first record to load 
		  //  params.count - the number of records to fetch from that start position
		  //Spring Data Rest URL params
		  //  page - the page to show
		  //  size - page size 
		  
		  var page = params.start / params.count
          url += "&page="+page+"&size="+params.count
		}
		if (params.sort) {
		  if (params.sort.id == "createdBy") {
		    url += "&sort=createdBy.profile.name," + params.sort.dir
		  } else {
		    url += "&sort="+params.sort.id + "," + params.sort.dir
		  }
		}
	  console.log("Loading ideas", params, url)
		webix.ajax().get(url).then(function(data){
      console.log("GET ", url, "returned", data.json())
		  var response = {
			  data: data.json()._embedded.laws,
			  pos: params.start || 0,
			  total_count: data.json().page.totalElements   // this is returned from the Spring Data PagingAndSortingRepository
		  }
      webix.ajax.$callback(view, callback, response);
    }).catch(err => {
		  console.error("ERROR", err);
		})
	}
};




// ========== Other possible implementations that I checked


/*
 * WebIX DataDriver
 *
export const ideasData = webix.extend({
    //records:"_embedded.laws",
    
	getDetails:function(obj){
        console.log("getDetails", obj)
        return obj;
    }
	
}, webix.DataDriver.json);
*/

/*
// plain function => but does not know the view !
export const ideasProxy = function(params) {
	console.log("loading ideas", params)
	
	var url = ideasUrl
	if (params.start !== undefined && params.count !== undefined) {
		var page = view.data.$pagesize ? params.start / view.data.$pagesize : 0
        url+="&page="+page+"&size="+params.count
		console.log("with paging", url)
	}
	
	return webix.ajax(url).then(function(data){
	  console.log("received ideas", data.json())
	  return data.json()._embedded.laws
	}).catch(err => {
	  console.error("ERROR", err);
	})
}

*/

/*  Webix DataCollection  (loads all data at once)7
export const data = new webix.DataCollection({
    url:function() {
		var url = "http://localhost:8080/liquido/v2/laws/search/findByStatus?status=IDEA"
		console.log("loading ideas")
		return webix.ajax(url).then(function(data){
		  console.log("received ", data.json())
		  return data.json()._embedded.laws
	    })
	}	
	
	//TODO:  save:"..." // url for saving edited ideas 
});
*/

/*
export const data ={
  "_embedded" : {
    "laws" : [ {
      "id" : 41,
      "status" : "IDEA",
      "description" : "K3s9RpFS Lorem ipsum dolor sit amet, consectetur adip",
      "updatedAt" : "2017-10-16T12:02:47.550+0000",
      "createdAt" : "2017-10-16T12:02:47.550+0000",
      "createdBy" : {
        "createdAt" : "2017-10-16T12:02:46.210+0000",
        "updatedAt" : "2017-10-16T12:02:46.210+0000",
        "id" : 1,
        "email" : "testuser0@liquido.de",
        "profile" : {
          "name" : "Test User0",
          "website" : "http://www.liquido.de",
          "picture" : "/static/img/Avatar_32x32.jpeg"
        }
      },
      "area" : {
        "createdAt" : "2017-10-16T12:02:46.879+0000",
        "updatedAt" : "2017-10-16T12:02:46.879+0000",
        "id" : 25,
        "title" : "Area 0",
        "description" : "Nice description for test area #0"
      },
      "numSupporters" : 2,
      "title" : "Idea 0 that suggest that we definitely need a longer title for ideas",
      "initialProposal" : false,
      "reachedQuorumAt" : null,
      "votingEndsAt" : null,
      "supportedByCurrentUser" : false,
      "numCompetingProposals" : 0,
      "votingStartsAt" : null,
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/liquido/v2/laws/41"
        },
        "law" : {
          "href" : "http://localhost:8080/liquido/v2/laws/41{?projection}",
          "templated" : true
        },
        "area" : {
          "href" : "http://localhost:8080/liquido/v2/laws/41/area"
        },
        "createdBy" : {
          "href" : "http://localhost:8080/liquido/v2/laws/41/createdBy"
        },
        "supporters" : {
          "href" : "http://localhost:8080/liquido/v2/laws/41/supporters"
        },
        "poll" : {
          "href" : "http://localhost:8080/liquido/v2/laws/41/poll"
        }
      }
    }, {
      "id" : 42,
      "status" : "IDEA",
      "description" : "yJwwWnOn Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nos",
      "updatedAt" : "2017-10-16T12:02:47.591+0000",
      "createdAt" : "2017-10-16T12:02:47.591+0000",
      "createdBy" : {
        "createdAt" : "2017-10-16T12:02:46.615+0000",
        "updatedAt" : "2017-10-16T12:02:46.615+0000",
        "id" : 2,
        "email" : "testuser1@liquido.de",
        "profile" : {
          "name" : "Test User1",
          "website" : "http://www.liquido.de",
          "picture" : "/static/img/Avatar_32x32.jpeg"
        }
      },
      "area" : {
        "createdAt" : "2017-10-16T12:02:46.879+0000",
        "updatedAt" : "2017-10-16T12:02:46.879+0000",
        "id" : 25,
        "title" : "Area 0",
        "description" : "Nice description for test area #0"
      },
      "numSupporters" : 1,
      "title" : "Idea 1 that suggest that we definitely need a longer title for ideas",
      "initialProposal" : false,
      "reachedQuorumAt" : null,
      "votingEndsAt" : null,
      "supportedByCurrentUser" : false,
      "numCompetingProposals" : 0,
      "votingStartsAt" : null,
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/liquido/v2/laws/42"
        },
        "law" : {
          "href" : "http://localhost:8080/liquido/v2/laws/42{?projection}",
          "templated" : true
        },
        "area" : {
          "href" : "http://localhost:8080/liquido/v2/laws/42/area"
        },
        "createdBy" : {
          "href" : "http://localhost:8080/liquido/v2/laws/42/createdBy"
        },
        "supporters" : {
          "href" : "http://localhost:8080/liquido/v2/laws/42/supporters"
        },
        "poll" : {
          "href" : "http://localhost:8080/liquido/v2/laws/42/poll"
        }
      }
    }, {
      "id" : 43,
      "status" : "IDEA",
      "description" : "wczXsRVa Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitat",
      "updatedAt" : "2017-10-16T12:02:47.611+0000",
      "createdAt" : "2017-10-16T12:02:47.611+0000",
      "createdBy" : {
        "createdAt" : "2017-10-16T12:02:46.623+0000",
        "updatedAt" : "2017-10-16T12:02:46.623+0000",
        "id" : 3,
        "email" : "testuser2@liquido.de",
        "profile" : {
          "name" : "Test User2",
          "website" : "http://www.liquido.de",
          "picture" : "/static/img/Avatar_32x32.jpeg"
        }
      },
      "area" : {
        "createdAt" : "2017-10-16T12:02:46.879+0000",
        "updatedAt" : "2017-10-16T12:02:46.879+0000",
        "id" : 25,
        "title" : "Area 0",
        "description" : "Nice description for test area #0"
      },
      "numSupporters" : 3,
      "title" : "Idea 2 that suggest that we definitely need a longer title for ideas",
      "initialProposal" : false,
      "reachedQuorumAt" : null,
      "votingEndsAt" : null,
      "supportedByCurrentUser" : false,
      "numCompetingProposals" : 0,
      "votingStartsAt" : null,
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/liquido/v2/laws/43"
        },
        "law" : {
          "href" : "http://localhost:8080/liquido/v2/laws/43{?projection}",
          "templated" : true
        },
        "area" : {
          "href" : "http://localhost:8080/liquido/v2/laws/43/area"
        },
        "createdBy" : {
          "href" : "http://localhost:8080/liquido/v2/laws/43/createdBy"
        },
        "supporters" : {
          "href" : "http://localhost:8080/liquido/v2/laws/43/supporters"
        },
        "poll" : {
          "href" : "http://localhost:8080/liquido/v2/laws/43/poll"
        }
      }
    }, {
      "id" : 44,
      "status" : "IDEA",
      "description" : "WC0C9LzJ Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitatio",
      "updatedAt" : "2017-10-16T12:02:47.628+0000",
      "createdAt" : "2017-10-16T12:02:47.628+0000",
      "createdBy" : {
        "createdAt" : "2017-10-16T12:02:46.643+0000",
        "updatedAt" : "2017-10-16T12:02:46.643+0000",
        "id" : 4,
        "email" : "testuser3@liquido.de",
        "profile" : {
          "name" : "Test User3",
          "website" : "http://www.liquido.de",
          "picture" : "/static/img/Avatar_32x32.jpeg"
        }
      },
      "area" : {
        "createdAt" : "2017-10-16T12:02:46.879+0000",
        "updatedAt" : "2017-10-16T12:02:46.879+0000",
        "id" : 25,
        "title" : "Area 0",
        "description" : "Nice description for test area #0"
      },
      "numSupporters" : 1,
      "title" : "Idea 3 that suggest that we definitely need a longer title for ideas",
      "initialProposal" : false,
      "reachedQuorumAt" : null,
      "votingEndsAt" : null,
      "supportedByCurrentUser" : false,
      "numCompetingProposals" : 0,
      "votingStartsAt" : null,
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/liquido/v2/laws/44"
        },
        "law" : {
          "href" : "http://localhost:8080/liquido/v2/laws/44{?projection}",
          "templated" : true
        },
        "area" : {
          "href" : "http://localhost:8080/liquido/v2/laws/44/area"
        },
        "createdBy" : {
          "href" : "http://localhost:8080/liquido/v2/laws/44/createdBy"
        },
        "supporters" : {
          "href" : "http://localhost:8080/liquido/v2/laws/44/supporters"
        },
        "poll" : {
          "href" : "http://localhost:8080/liquido/v2/laws/44/poll"
        }
      }
    }, {
      "id" : 45,
      "status" : "IDEA",
      "description" : "AEg28Cka Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
      "updatedAt" : "2017-10-16T12:02:47.637+0000",
      "createdAt" : "2017-10-16T12:02:47.637+0000",
      "createdBy" : {
        "createdAt" : "2017-10-16T12:02:46.658+0000",
        "updatedAt" : "2017-10-16T12:02:46.658+0000",
        "id" : 5,
        "email" : "testuser4@liquido.de",
        "profile" : {
          "name" : "Test User4",
          "website" : "http://www.liquido.de",
          "picture" : "/static/img/Avatar_32x32.jpeg"
        }
      },
      "area" : {
        "createdAt" : "2017-10-16T12:02:46.879+0000",
        "updatedAt" : "2017-10-16T12:02:46.879+0000",
        "id" : 25,
        "title" : "Area 0",
        "description" : "Nice description for test area #0"
      },
      "numSupporters" : 2,
      "title" : "Idea 4 that suggest that we definitely need a longer title for ideas",
      "initialProposal" : false,
      "reachedQuorumAt" : null,
      "votingEndsAt" : null,
      "supportedByCurrentUser" : false,
      "numCompetingProposals" : 0,
      "votingStartsAt" : null,
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/liquido/v2/laws/45"
        },
        "law" : {
          "href" : "http://localhost:8080/liquido/v2/laws/45{?projection}",
          "templated" : true
        },
        "area" : {
          "href" : "http://localhost:8080/liquido/v2/laws/45/area"
        },
        "createdBy" : {
          "href" : "http://localhost:8080/liquido/v2/laws/45/createdBy"
        },
        "supporters" : {
          "href" : "http://localhost:8080/liquido/v2/laws/45/supporters"
        },
        "poll" : {
          "href" : "http://localhost:8080/liquido/v2/laws/45/poll"
        }
      }
    }, {
      "id" : 46,
      "status" : "IDEA",
      "description" : "AdgddcmM Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim",
      "updatedAt" : "2017-10-16T12:02:47.653+0000",
      "createdAt" : "2017-10-16T12:02:47.653+0000",
      "createdBy" : {
        "createdAt" : "2017-10-16T12:02:46.670+0000",
        "updatedAt" : "2017-10-16T12:02:46.670+0000",
        "id" : 6,
        "email" : "testuser5@liquido.de",
        "profile" : {
          "name" : "Test User5",
          "website" : "http://www.liquido.de",
          "picture" : "/static/img/Avatar_32x32.jpeg"
        }
      },
      "area" : {
        "createdAt" : "2017-10-16T12:02:46.879+0000",
        "updatedAt" : "2017-10-16T12:02:46.879+0000",
        "id" : 25,
        "title" : "Area 0",
        "description" : "Nice description for test area #0"
      },
      "numSupporters" : 1,
      "title" : "Idea 5 that suggest that we definitely need a longer title for ideas",
      "initialProposal" : false,
      "reachedQuorumAt" : null,
      "votingEndsAt" : null,
      "supportedByCurrentUser" : false,
      "numCompetingProposals" : 0,
      "votingStartsAt" : null,
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/liquido/v2/laws/46"
        },
        "law" : {
          "href" : "http://localhost:8080/liquido/v2/laws/46{?projection}",
          "templated" : true
        },
        "area" : {
          "href" : "http://localhost:8080/liquido/v2/laws/46/area"
        },
        "createdBy" : {
          "href" : "http://localhost:8080/liquido/v2/laws/46/createdBy"
        },
        "supporters" : {
          "href" : "http://localhost:8080/liquido/v2/laws/46/supporters"
        },
        "poll" : {
          "href" : "http://localhost:8080/liquido/v2/laws/46/poll"
        }
      }
    }, {
      "id" : 47,
      "status" : "IDEA",
      "description" : "UQrTfSeL Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteu",
      "updatedAt" : "2017-10-16T12:02:47.692+0000",
      "createdAt" : "2017-10-16T12:02:47.692+0000",
      "createdBy" : {
        "createdAt" : "2017-10-16T12:02:46.678+0000",
        "updatedAt" : "2017-10-16T12:02:46.678+0000",
        "id" : 7,
        "email" : "testuser6@liquido.de",
        "profile" : {
          "name" : "Test User6",
          "website" : "http://www.liquido.de",
          "picture" : "/static/img/Avatar_32x32.jpeg"
        }
      },
      "area" : {
        "createdAt" : "2017-10-16T12:02:46.879+0000",
        "updatedAt" : "2017-10-16T12:02:46.879+0000",
        "id" : 25,
        "title" : "Area 0",
        "description" : "Nice description for test area #0"
      },
      "numSupporters" : 3,
      "title" : "Idea 6 that suggest that we definitely need a longer title for ideas",
      "initialProposal" : false,
      "reachedQuorumAt" : null,
      "votingEndsAt" : null,
      "supportedByCurrentUser" : false,
      "numCompetingProposals" : 0,
      "votingStartsAt" : null,
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/liquido/v2/laws/47"
        },
        "law" : {
          "href" : "http://localhost:8080/liquido/v2/laws/47{?projection}",
          "templated" : true
        },
        "area" : {
          "href" : "http://localhost:8080/liquido/v2/laws/47/area"
        },
        "createdBy" : {
          "href" : "http://localhost:8080/liquido/v2/laws/47/createdBy"
        },
        "supporters" : {
          "href" : "http://localhost:8080/liquido/v2/laws/47/supporters"
        },
        "poll" : {
          "href" : "http://localhost:8080/liquido/v2/laws/47/poll"
        }
      }
    }, {
      "id" : 48,
      "status" : "IDEA",
      "description" : "BDFrWFg6 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna ",
      "updatedAt" : "2017-10-16T12:02:47.703+0000",
      "createdAt" : "2017-10-16T12:02:47.703+0000",
      "createdBy" : {
        "createdAt" : "2017-10-16T12:02:46.691+0000",
        "updatedAt" : "2017-10-16T12:02:46.691+0000",
        "id" : 8,
        "email" : "testuser7@liquido.de",
        "profile" : {
          "name" : "Test User7",
          "website" : "http://www.liquido.de",
          "picture" : "/static/img/Avatar_32x32.jpeg"
        }
      },
      "area" : {
        "createdAt" : "2017-10-16T12:02:46.879+0000",
        "updatedAt" : "2017-10-16T12:02:46.879+0000",
        "id" : 25,
        "title" : "Area 0",
        "description" : "Nice description for test area #0"
      },
      "numSupporters" : 3,
      "title" : "Idea 7 that suggest that we definitely need a longer title for ideas",
      "initialProposal" : false,
      "reachedQuorumAt" : null,
      "votingEndsAt" : null,
      "supportedByCurrentUser" : false,
      "numCompetingProposals" : 0,
      "votingStartsAt" : null,
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/liquido/v2/laws/48"
        },
        "law" : {
          "href" : "http://localhost:8080/liquido/v2/laws/48{?projection}",
          "templated" : true
        },
        "area" : {
          "href" : "http://localhost:8080/liquido/v2/laws/48/area"
        },
        "createdBy" : {
          "href" : "http://localhost:8080/liquido/v2/laws/48/createdBy"
        },
        "supporters" : {
          "href" : "http://localhost:8080/liquido/v2/laws/48/supporters"
        },
        "poll" : {
          "href" : "http://localhost:8080/liquido/v2/laws/48/poll"
        }
      }
    }, {
      "id" : 49,
      "status" : "IDEA",
      "description" : "K8GEYh9f Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "updatedAt" : "2017-10-16T12:02:47.727+0000",
      "createdAt" : "2017-10-16T12:02:47.727+0000",
      "createdBy" : {
        "createdAt" : "2017-10-16T12:02:46.699+0000",
        "updatedAt" : "2017-10-16T12:02:46.699+0000",
        "id" : 9,
        "email" : "testuser8@liquido.de",
        "profile" : {
          "name" : "Test User8",
          "website" : "http://www.liquido.de",
          "picture" : "/static/img/Avatar_32x32.jpeg"
        }
      },
      "area" : {
        "createdAt" : "2017-10-16T12:02:46.879+0000",
        "updatedAt" : "2017-10-16T12:02:46.879+0000",
        "id" : 25,
        "title" : "Area 0",
        "description" : "Nice description for test area #0"
      },
      "numSupporters" : 1,
      "title" : "Idea 8 that suggest that we definitely need a longer title for ideas",
      "initialProposal" : false,
      "reachedQuorumAt" : null,
      "votingEndsAt" : null,
      "supportedByCurrentUser" : false,
      "numCompetingProposals" : 0,
      "votingStartsAt" : null,
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/liquido/v2/laws/49"
        },
        "law" : {
          "href" : "http://localhost:8080/liquido/v2/laws/49{?projection}",
          "templated" : true
        },
        "area" : {
          "href" : "http://localhost:8080/liquido/v2/laws/49/area"
        },
        "createdBy" : {
          "href" : "http://localhost:8080/liquido/v2/laws/49/createdBy"
        },
        "supporters" : {
          "href" : "http://localhost:8080/liquido/v2/laws/49/supporters"
        },
        "poll" : {
          "href" : "http://localhost:8080/liquido/v2/laws/49/poll"
        }
      }
    }, {
      "id" : 50,
      "status" : "IDEA",
      "description" : "GPWtE9f8 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ",
      "updatedAt" : "2017-10-16T12:02:47.819+0000",
      "createdAt" : "2017-10-16T12:02:47.819+0000",
      "createdBy" : {
        "createdAt" : "2017-10-16T12:02:46.705+0000",
        "updatedAt" : "2017-10-16T12:02:46.705+0000",
        "id" : 10,
        "email" : "testuser9@liquido.de",
        "profile" : {
          "name" : "Test User9",
          "website" : "http://www.liquido.de",
          "picture" : "/static/img/Avatar_32x32.jpeg"
        }
      },
      "area" : {
        "createdAt" : "2017-10-16T12:02:46.879+0000",
        "updatedAt" : "2017-10-16T12:02:46.879+0000",
        "id" : 25,
        "title" : "Area 0",
        "description" : "Nice description for test area #0"
      },
      "numSupporters" : 5,
      "title" : "Idea 9 that reached its quorum",
      "initialProposal" : false,
      "reachedQuorumAt" : null,
      "votingEndsAt" : null,
      "supportedByCurrentUser" : false,
      "numCompetingProposals" : 0,
      "votingStartsAt" : null,
      "_links" : {
        "self" : {
          "href" : "http://localhost:8080/liquido/v2/laws/50"
        },
        "law" : {
          "href" : "http://localhost:8080/liquido/v2/laws/50{?projection}",
          "templated" : true
        },
        "area" : {
          "href" : "http://localhost:8080/liquido/v2/laws/50/area"
        },
        "createdBy" : {
          "href" : "http://localhost:8080/liquido/v2/laws/50/createdBy"
        },
        "supporters" : {
          "href" : "http://localhost:8080/liquido/v2/laws/50/supporters"
        },
        "poll" : {
          "href" : "http://localhost:8080/liquido/v2/laws/50/poll"
        }
      }
    } ]
  },
  "_links" : {
    "self" : {
      "href" : "http://localhost:8080/liquido/v2/laws/search/findByStatus?status=IDEA"
    }
  }
}
*/