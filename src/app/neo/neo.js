﻿angular.module("neograph.neo",["neograph.utils","neograph.neo.client"])
.factory("neo", ["neoClient",  "utils",function (neoClient, utils) {


    var that = {
 
        getGraph: function (q,returnArray) {

            return neoClient.graph.get({ q: q, returnArray: returnArray }).$promise.then(function (data) {

                var out = data.toJSON();
                console.dir(out);
                return out;

            });
        }
       ,
        //returns all relationships between supplied nodes, which can be vis.Dataset or graph data object
        getAllRelationships: function (nodes) {
            var nodeIds = "";

            if (nodes.getIds) //if vis.DataSet
            {
                nodeIds = nodes.getIds({ returnType: 'Array' }).join(",");
            }
            else { //otherwise data object

                for (var key in nodes) {
                    if (nodeIds.length) {
                        nodeIds += ",";
                    }
                    nodeIds += key;
                }
            }

            var q = "MATCH a -[r]- b WHERE id(a) IN[" + nodeIds + "] and id(b) IN[" + nodeIds + "] and not (a-[:TYPE_OF]-b) return r";

            return that.getGraph(q);

        }
  
             ,
        getRelationships: function (id) {

                return neoClient.node.getRelationships({ id: id }).$promise.then(function (data) {
                    return data.toJSON();
                });
            

        }

        ,
        saveMultiple: function (multiple) {

        
            return neoClient.node.saveMultiple({ multiple: multiple }).$promise.then(function (data) {
                return data.toJSON();
            });


        }
           ,
        //saves edge to neo (update/create)
        //TODO: according to certain rules labels will need to be maintained when relationships are created. (update not required as we always delete and recreate when changing start/end nodes)
        //tag a with label b where:
        // a=person and b=provenance (eg painter from france)
        // a=person and n=group, period (eg painter part of les fauves / roccocco)
        // a=picture and b=non-person (eg picture by corot / of tree) - although typically this will be managed through labels directly (which will then in turn has to keep relationships up to date)
        saveEdge: function (e) {//startNode and endNode provide the full node objects for the edge

            return neoClient.edge.save({ edge: e }).$promise.then(function (data) {
                return data.toJSON();
            });
        }
        ,
        saveFavourite: function (node, user) {

           
            return neoClient.user.saveFavourite({ user: user, node: node }).$promise.then(function (data) {
                return data.toJSON();
            });


        }

        ,
        deleteEdge: function (edge) {

            if (edge && edge.id) {

                return neoClient.edge.delete({ edge: edge }).$promise.then(function (data) {
                    return data.toJSON();
                });
            

            }

        }
        ,
        getUser: function (userLookup) {
          
            return neoClient.user.get({ user: userLookup }).$promise.then(function (data) {
        
                return data.toJSON();
            });

        }
        ,

        getOne: function (q) {//q must be a match return a single entity n

          

            return neoClient.node.getOne({ q: q }).$promise.then(function (data) {
                return data.toJSON();
            });

        }

     ,
        getImageRelationships: function (edge) { //loks up id/label first then call get by label

            return neoClient.edge.getImageRelationships({ edge: edge }).$promise.then(function (data) {
                return data.toJSON();
            });

        }

        ,
        //Alternatively i could query the actual labels and merge them into a distinct array
        getDistinctLabels: function (labels) {

          
            return neoClient.utils.getDistinctLabels({ labels: labels }).$promise;//returns array
            


        }
        ,
        getDistinctLabelsQuery: function (q) {

            return neoClient.utils.getDistinctLabels({ q: q }).$promise;//returns array

        }

    }

    return that;

}]);