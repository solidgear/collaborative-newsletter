/**
 * Created by dvicente@solidgear.es on 28/08/2017
 */
var assert = require('chai').assert;
var expect = require('chai').expect;
var randtoken = require('rand-token');
var config = require('../../../config');
var refreshTokensDB = require('../../../db/auth/refreshTokens');

var userId = '576ba5fbd53a99435276aec5';

describe('Refresh tokens', function () {

    describe('Create', function () {
        var refreshTokenString;

        after(function () {
            return refreshTokensDB.deleteRefreshToken(refreshTokenString)
            .then(() => {
            });
        })

        it('Create refresh token', function () {
            return refreshTokensDB.createRefreshToken(randtoken.uid(config.TOKEN_LENGTH), userId)
            .then(refreshToken => {
                assert.isNotNull(refreshToken);
                assert.equal(refreshToken.userId, userId);
                refreshTokenString = refreshToken.refreshToken;
            });
        })
    })


    describe('Delete', function () {
        var refreshTokenString;

        before(function () {
            return refreshTokensDB.createRefreshToken(randtoken.uid(config.TOKEN_LENGTH), userId)
            .then(refreshToken => {
                refreshTokenString = refreshToken.refreshToken;
            });
        })

        it('Delete refresh token', function () {
            return refreshTokensDB.deleteRefreshToken(refreshTokenString)
            .then(() => {
                return refreshTokensDB.getRefreshToken(refreshTokenString);
            })
            .then(refreshToken => {
                assert.isNull(refreshToken);
            });
        })
    })


    describe('Get', function () {
        var refreshTokenString, refreshTokenId;

        before(function () {
            return refreshTokensDB.createRefreshToken(randtoken.uid(config.TOKEN_LENGTH), userId)
            .then(refreshToken => {
                refreshTokenString = refreshToken.refreshToken;
                refreshTokenId = refreshToken._id;
            });
        })

        after(function () {
            return refreshTokensDB.deleteRefreshToken(refreshTokenString)
            .then(() => {
            });
        })

        it('Get refresh token by token', function () {
            return refreshTokensDB.getRefreshToken(refreshTokenString)
            .then(refreshToken => {
                assert.equal(refreshToken.userId, userId);
            });
        })

        it('Get refresh token by userId', function () {
            return refreshTokensDB.getRefreshTokenByUserId(userId)
            .then(refreshToken => {
                assert.equal(refreshToken.userId, userId);
            });
        })
    })

});