Tags = require '../lib/tags'
{sep} = require 'path'

describe 'Tags', ->
  tags = null
  path = "#{__dirname}#{sep}fixtures#{sep}"

  beforeEach ->
    atom.project.setPaths([path])

    pkg = atom.packages.loadPackage('ide-haskell-hasktags')
    pkg.activateNow()

    waitsFor 'tags', ->
      tags = pkg.mainModule.tags

    waitsFor ->
      not tags.inProgress

  describe 'listTags()', ->
    it 'parses one directory or file', ->
      expect(tags.listTags()).toContain
        tag : 'main'
        uri : "#{path}test1.hs"
        line : 2
      expect(tags.listTags()).not.toContain
        tag : 'main'
        uri : "#{path}test1.hs"
        line : 3
      expect(tags.listTags()).toContain
        tag : 'main'
        uri : "#{path}test2.hs"
        line : 2
      expect(tags.listTags()).toContain
        tag : 'main'
        uri : "#{path}test2.hs"
        line : 21
