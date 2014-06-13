window.Quora = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  createSession: function(){
    Quora.userSession = new Quora.Models.Session({ email: Quora.currentUser.get("email")});
    $.ajax({
      type: "GET",
      url: "/api/users/" + Quora.currentUser.id + "/userinfo",
      success: function(response){
        Quora.currentUser.parseUserInfo(response)
      }
    })
    var navbarView = new Quora.Views.NavBar({
      model: Quora.currentUser
    });
    $("#navbar").html(navbarView.render().$el)

    Quora.numVisitsPages = {};
  },
  initialize: function() {

    Quora.userFollowers = Quora.userFollowers || new Quora.Collections.Users();
    Quora.allUsers = new Quora.Collections.Users();
    Quora.usersFetched = new Quora.Collections.Users();
    Quora.relevantQnUsers = new Quora.Collections.Users();
    Quora.answers = new Quora.Collections.Answers();
    Quora.questions = new Quora.Collections.Questions();
    Quora.topics = new Quora.Collections.Topics();
    Quora.followings = new Quora.Collections.Followings();
    Quora.upvotes = new Quora.Collections.Upvotes();
    Quora.topicQuestionJoins = new Quora.Collections.TopicQuestionJoins();
    Quora.relUserJoins = new Quora.Collections.QnRelevantUsers(); //Join table
    
    Quora.currentRouter = new Quora.Routers.Users({
      $rootEl: $("div#content"),
      $navbar: $("div#navbar")
    });
    if (!Backbone.History.started){
          Backbone.history.start();
    }
    
    Backbone.history.navigate(window.location.hash, { trigger: true });
  }
};



Backbone.CompositeView = Backbone.View.extend({
  addSubview: function (selector, subview) {
    this.subviews(selector).push(subview);
    // Try to attach the subview. Render it as a convenience.
    this.attachSubview(selector, subview.render());
  },

  attachSubview: function (selector, subview) {
    this.$(selector).append(subview.$el);
    // Bind events in case `subview` has previously been removed from
    // DOM.
    subview.delegateEvents();
    if (subview.attachSubviews) {
      subview.attachSubviews();
    }
  },

  attachSubviews: function () {
    var view = this;
    _(this.subviews()).each(function (subviews, selector) {
      view.$(selector).empty();
      _(subviews).each(function (subview) {
        view.attachSubview(selector, subview);
      });
    });
  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _(this.subviews()).each(function (subviews) {
      _(subviews).each(function (subview) { subview.remove(); });
    });
  },

  removeSubview: function (selector, subview) {
    subview.remove();

    var subviews = this.subviews(selector);
    subviews.splice(subviews.indexOf(subview), 1);
  },

  removeAllSubviews: function(selector){
    var view = this;
    var selectorSubviews = this.subviews(selector);
    var i = 0;
    var lengthSubviews = selectorSubviews.length
    while (i < lengthSubviews){
      i += 1;
      subview = selectorSubviews["0"];
      view.removeSubview(selector, subview)
    }
  },

  subviews: function (selector) {
    // Map of selectors to subviews that live inside that selector.
    // Optionally pass a selector and I'll initialize/return an array
    // of subviews for the sel.
    this._subviews = this._subviews || {};

    if (!selector) {
      return this._subviews;
    } else {
      this._subviews[selector] = this._subviews[selector] || [];
      return this._subviews[selector];
    }
  }
});


$(document).ready(function(){
  Quora.initialize();
});

