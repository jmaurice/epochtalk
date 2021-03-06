module.exports = ['$rootScope', '$scope', '$anchorScroll', '$location', '$timeout', 'Session', 'Boards', 'Threads', 'board', 'threads', 'page', 'threadLimit', 'postLimit',
  function($rootScope, $scope, $anchorScroll, $location, $timeout, Session, Boards, Threads, board, threads, page, threadLimit, postLimit) {
    var ctrl = this;
    this.loggedIn = Session.isAuthenticated; // check Auth
    this.board = board;
    this.page = page; // this page
    this.postLimit = postLimit;
    this.threadLimit = threadLimit;
    this.threads = threads;

    this.parent = $scope.$parent.BoardWrapperCtrl;
    this.parent.loggedIn = Session.isAuthenticated;
    this.parent.board  = board;
    this.parent.page = page;
    this.parent.pageCount = Math.ceil(board.thread_count / threadLimit);
    this.parent.newThreadUrl = '/boards/' + board.id + '/threads/new';

    // generate page listing for each thread
    this.getPageKeysForThread = function(thread) {
      var pageKeys = [];
      var urlPrefix = '/threads/' + thread.id + '/posts?page=';
      if (thread.page_count < 7) {
        var i = 1;
        while(pageKeys.push({ val: i.toString(), url: urlPrefix + i++}) < thread.page_count) {}
      }
      else {
        var thirdToLastPage = (thread.page_count - 2).toString();
        var secondToLastPage = (thread.page_count - 1).toString();
        var lastPage = thread.page_count.toString();
        pageKeys.push({ val: '1', url: urlPrefix + '1' });
        pageKeys.push({ val: '2', url: urlPrefix + '2' });
        pageKeys.push({ val: '3', url: urlPrefix + '3' });
        pageKeys.push({ val: '&hellip;', url: null });
        pageKeys.push({ val: thirdToLastPage, url: urlPrefix + thirdToLastPage });
        pageKeys.push({ val: secondToLastPage, url: urlPrefix + secondToLastPage });
        pageKeys.push({ val: lastPage, url: urlPrefix + lastPage });
      }
      pageKeys.push({ val: 'All', url: urlPrefix + '1&limit=all' });
      thread.page_keys = pageKeys;
    };

    // page count for each thread
    threads.forEach(function(thread) {
      // user based UI
      if (thread.has_new_post) { thread.title_class = 'bold'; }
      thread.page_count = Math.ceil(thread.post_count / ctrl.postLimit);
      ctrl.getPageKeysForThread(thread);
    });

    // Scroll fix for nested state
    $timeout($anchorScroll);

    this.offLCS = $rootScope.$on('$locationChangeSuccess', function(event){
      var params = $location.search();
      var page = Number(params.page) || 1;
      var limit = Number(params.limit) || 10;
      var pageChanged = false;
      var limitChanged = false;

      if (page && page !== ctrl.page) {
        pageChanged = true;
        ctrl.parent.page = page;
        ctrl.page = page;
      }
      if (limit && limit !== ctrl.threadLimit) {
        limitChanged = true;
        ctrl.threadLimit = limit;
      }

      if(pageChanged || limitChanged) { ctrl.pullPage(); }
    });
    $scope.$on('$destroy', function() { ctrl.offLCS(); });

    this.pullPage = function() {
      var query = {
        board_id: ctrl.board.id,
        page: ctrl.page,
        limit: ctrl.threadLimit
      };

      // update board's thread page count
      Boards.get({ id: ctrl.board.id }).$promise
      .then(function(board) {
        ctrl.parent.pageCount = Math.ceil(board.thread_count / ctrl.threadLimit);
      });

      // replace current threads with new threads
      Threads.byBoard(query).$promise
      .then(function(threads) {
        ctrl.threads = threads;
        ctrl.threads.forEach(function(thread) {
          // user based UI
          if (thread.has_new_post) { thread.title_class = 'bold'; }
          thread.page_count = Math.ceil(thread.post_count / ctrl.postLimit);
          ctrl.getPageKeysForThread(thread);
        });
        $timeout($anchorScroll);
      });
    };

  }
];
