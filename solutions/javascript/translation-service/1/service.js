/// <reference path="./global.d.ts" />
// @ts-check
//
// The lines above enable type checking for this file. Various IDEs interpret
// the @ts-check and reference directives. Together, they give you helpful
// autocompletion when implementing this exercise. You don't need to understand
// them in order to use it.
//
// In your own projects, files, and code, you can play with @ts-check as well.
import {
  AbusiveClientError,
  NotAvailable,
  Untranslatable,
  ConnectionError,
} from './errors';

// class BatchIsEmpty extends Error{};

export class TranslationService {
  /**
   * Creates a new service
   * @param {ExternalApi} api the original api
   */
  constructor(api) {
    this.api = api;
  }

  /**
   * Attempts to retrieve the translation for the given text.
   *
   * - Returns whichever translation can be retrieved, regardless the quality
   * - Forwards any error from the translation api
   *
   * @param {string} text
   * @returns {Promise<string>}
   */
  free(text) {
    const freePromise = this.api.fetch(text)
      .then(function (status) {
        return status.translation;
      })
      .catch(function (reason){
        if (reason instanceof NotAvailable){
          throw new NotAvailable(reason);
        }else{
          throw new Untranslatable(reason);
        }
    }); 
    return freePromise;
  }

  /**
   * Batch translates the given texts using the free service.
   *
   * - Resolves all the translations (in the same order), if they all succeed
   * - Rejects with the first error that is encountered
   * - Rejects with a BatchIsEmpty error if no texts are given
   *
   * @param {string[]} texts
   * @returns {Promise<string[]>}
   */
  batch(texts) {
    if (!texts || texts.length == 0){
      return Promise.reject(new BatchIsEmpty());
    }else {
      const batchPromise = texts.map(text => this.free(text));
      return Promise.all(batchPromise);
    }
  }

  /**
   * Requests the service for some text to be translated.
   *
   * Note: the request service is flaky, and it may take up to three times for
   *       it to accept the request.
   *
   * @param {string} text
   * @returns {Promise<void>}
   */
  request(text) {
    if (this.free(text) instanceof NotAvailable) {
      return Promise.reject(new Untranslatable());
    }
    
    const maxAttempts = 3;
    let attempt = 0;

    return new Promise((resolve, reject) => {
      const tryRequest = () => {
        attempt++;
        this.api.request(text, (err) => {
          if (!err) {
            return resolve(undefined);
          }

          if (attempt < maxAttempts) {
            // setTimeout(tryRequest, 100 * attempt);
            return tryRequest();
          }

          // no retries == reject
          return reject(err);
        });
      };

      tryRequest();
    });


  }

  

  /**
   * Retrieves the translation for the given text
   *
   * - Rejects with an error if the quality can not be met
   * - Requests a translation if the translation is not available, then retries
   *
   * @param {string} text
   * @param {number} minimumQuality
   * @returns {Promise<string>}
   */
  premium(text, minimumQuality){
    const fullFetch = this.api.fetch(text)
        .then(function (status) {
          return status;
        });
        
      const onFulfilled = (resolved) => {
        console.log(resolved);
        if (resolved.quality < minimumQuality) {
          return Promise.reject(new QualityThresholdNotMet);
        }else{
          console.log("Quality met");
          return resolved.translation;
        }
      }
  
      const onRejected = () => {
        return this.request(text).then(() => {
          return this.api.fetch(text)
            .then(check => {
              console.log(check);
              if (check.quality < minimumQuality) {
                return Promise.reject(new QualityThresholdNotMet(text));
              }
              return check.translation;
            }).catch((rejected) => {return Promise.reject(rejected);});;
        ;})
      }
      const premiumPromise = fullFetch.then(onFulfilled, onRejected);
      return premiumPromise;
    }
}

/**
 * This error is used to indicate a translation was found, but its quality does
 * not meet a certain threshold. Do not change the name of this error.
 */
export class QualityThresholdNotMet extends Error {
  /**
   * @param {string} text
   */
  constructor(text) {
    super(
      `
The translation of ${text} does not meet the requested quality threshold.
    `.trim(),
    );

    this.text = text;
  }
}

/**
 * This error is used to indicate the batch service was called without any
 * texts to translate (it was empty). Do not change the name of this error.
 */
export class BatchIsEmpty extends Error {
  constructor() {
    super(
      `
Requested a batch translation, but there are no texts in the batch.
    `.trim(),
    );
  }
}
