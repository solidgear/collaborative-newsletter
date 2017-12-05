/**
 * Created by dvicente@solidgear.es on 28/08/2017
 */
var assert = require('chai').assert;
var expect = require('chai').expect;
var config = require('../../../config');
var refreshTokensDomain = require('../../../domain/auth/refreshTokens');

var userId = '576ba5fbd53a99435276aec5';

describe('Refresh tokens', function () {

    describe('Create', function () {
        var refreshTokenString;

        after(function () {
            return refreshTokensDomain.deleteRefreshToken(refreshTokenString)
            .then(() => {
            });
        })

        it('Create refresh token', function () {
            return refreshTokensDomain.createRefreshToken(userId)
            .then(refreshToken => {
                assert.strictEqual(refreshToken.userId.toString(), userId);
                refreshTokenString = refreshToken.refreshToken;
            });
        })
    })


    describe('Delete', function () {
        var refreshTokenString;

        before(function () {
            return refreshTokensDomain.createRefreshToken(userId)
            .then(refreshToken => {
                refreshTokenString = refreshToken.refreshToken;
            });
        })

        it('Delete refresh token', function () {
            return refreshTokensDomain.deleteRefreshToken(refreshTokenString)
            .then(() => {
                return refreshTokensDomain.getRefreshToken(refreshTokenString)
            })
            .then(refreshToken => {
                assert.isNull(refreshToken);
            });
        })
    })


    describe('Get', function () {
        var refreshTokenString, refreshTokenId;

        before(function () {
            return refreshTokensDomain.createRefreshToken(userId)
            .then(refreshToken => {
                refreshTokenString = refreshToken.refreshToken;
                refreshTokenId = refreshToken._id;
            });
        })

        after(function () {
            return refreshTokensDomain.deleteRefreshToken(refreshTokenString)
            .then(() => {
            });
        })

        it('Get refresh token by token', function () {
            return refreshTokensDomain.getRefreshToken(refreshTokenString)
            .then(refreshToken => {
                assert.equal(refreshToken.userId, userId);
            });
        })

        it('Get refresh token by userId', function () {
            return refreshTokensDomain.getRefreshTokenByUserId(userId)
            .then(refreshToken => {
                assert.equal(refreshToken.userId, userId);
            });
        })
    })
});