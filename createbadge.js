var Github = require('github')
var resolve = require('url').resolve

module.exports = function (token, badge, done) {
  var github = new Github({
    debug: false,
    version: '3.0.0'
  })
  
  github.authenticate({
    type: 'oauth',
    token: token
  })
  
  var newGist = {
    'description': 'badge issued with GistBadges',
    'public': true,
    'files': {}
  }
    
  newGist.files['criteria.txt'] = {
    'content': badge.criteria
  }

  // create the gist first, so we can get the ID
  github.gists.create(newGist, function (err, gist) {
    if(err) {
      done(err)
      return
    }
    
    var gistURL = 'https://gist.github.com/'
    var url = gistURL + badge.issuer.name + '/' + gist.id + '/raw/'
    
    // issuer.json
    var issuerjson = {
      name: badge.issuer.name,
      url: gist.html_url
    }
    
    // class.json
    var classjson = {
      name: badge.name,
      description: badge.description,
      image: badge.image,
      criteria: resolve(url, 'criteria.txt'),
      issuer: resolve(url, 'issuer.json')
    }
    
    // 1.json
    var receiverjson = {
      uid: gist.id + '#1',
      recipient: {
        type: "email",
        hashed: false,
        identity: badge.receiver
      },
      issuedOn: (new Date()).toISOString(),
      badge: resolve(url, 'class.json'),
      verify: {
        type: 'hosted',
        url: resolve(url, '1.json')
      }
    }
    
    var updatedGist = {
      id: gist.id,
      files: {}
    }
    
    updatedGist.files['issuer.json'] = {
      content: JSON.stringify(issuerjson, null, '  ')
    }
    
    updatedGist.files['class.json'] = {
      content: JSON.stringify(classjson, null, '  ')
    }
    
    updatedGist.files['1.json'] = {
      content: JSON.stringify(receiverjson, null,'  ')
    }

    
    github.gists.edit(updatedGist, function (err, gist) {
      if(err) {
        done(err)
        return
      }
      done(null, gist)
    })
  })
  
}





