/**
 * @file Promise
 * @author wuyupeng
 */
(function (global) {

    function Promise(processor) {

        this._status = 'pending';

        var context = this;

        if (!processor) {
            return;
        }

        processor(
            function (res) {
                context._resolve(res);
            },
            function (err) {
                context._reject(err);
            }
        );
    }

    Promise.prototype = {

        constructor: Promise,

        taskCallBack: function (value, processor, next) {
            var result = null;
            var normal = 1;
            try {
                result = processor(value);
            }
            catch (err) {
                normal = 0;
                result = err;
            }

            if (result instanceof Promise) {

                result.next = next;

                result.then(function (res) {
                    next._resolve(res);
                });

                result.catch(function (err) {
                    next._reject(err);
                });
                return;
            }

            if (normal === 1) {
                next._resolve(result);
            }
            else {
                next._reject(result);
            }
        },

        onReject: function onReject(err) {
            this.next._reject(err);
        },

        onFulfilled: function onFulfilled(res) {
            this.next._resolve(res);
        },

        then: function then (onFulfilled) {

            this.next = new Promise();

            this.onFulfilled = onFulfilled;

            if (this._status === 'fulfilled') {
                this.taskCallBack(
                    this.currentValue,
                    this.onFulfilled.bind(this),
                    this.next
                );
            }
            return this.next;
        },

        catch: function (onReject) {
            this.next = new Promise();
            this.onReject = onReject;
            if (this._status === 'rejected') {
                this.taskCallBack(
                    this.currentErr,
                    this.onReject.bind(this),
                    this.next
                );
            }
            return this.next;
        },

        _resolve: function resolve(res) {
            this._status = 'fulfilled';
            this.currentValue = res;
            if (this.next && this.onFulfilled) {
                this.taskCallBack(
                    this.currentValue,
                    this.onFulfilled.bind(this),
                    this.next
                );
            }
        },

        _reject: function reject(err) {
            this._status = 'rejected';
            this.currentErr = err;
            if (this.next && this.onReject) {
                this.taskCallBack(
                    this.currentErr,
                    this.onReject.bind(this),
                    this.next
                );
            }
        }
    };

    global.Promise = Promise;
})(window);
