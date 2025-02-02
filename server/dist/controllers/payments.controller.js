"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var usersModel = require('../models/users.model');
var stripe = require('stripe')(process.env.STRIPE_TEST_KEY);
var checkout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var priceId, session, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!req.user) return [3 /*break*/, 2];
                priceId = req.body.items[0].id;
                return [4 /*yield*/, stripe.checkout.sessions.create({
                        payment_method_types: ['card'],
                        mode: 'subscription',
                        success_url: "".concat(process.env.ORIGIN, "/success?session_id={CHECKOUT_SESSION_ID}"),
                        cancel_url: "".concat(process.env.ORIGIN, "/dashboard"),
                        line_items: [
                            {
                                price: priceId,
                                quantity: 1
                            }
                        ]
                    })];
            case 1:
                session = _a.sent();
                res.status(201).send({ url: session.url });
                return [3 /*break*/, 3];
            case 2:
                res.status(401).send({ user: false });
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.log('Error in checkout controller', e_1);
                res.status(500).send({ status: 500 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var authenticatePurchase = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session_id, session, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!req.user) return [3 /*break*/, 3];
                session_id = req.body.session_id;
                return [4 /*yield*/, stripe.checkout.sessions.retrieve(session_id)];
            case 1:
                session = _a.sent();
                if (session.payment_status !== 'paid') {
                    res.status(400).send({ authenticated: false });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, usersModel.upgradeAccountToPro(req.user.email)];
            case 2:
                _a.sent();
                res.send({ authenticated: true });
                return [3 /*break*/, 4];
            case 3:
                res.status(401).send({ user: false });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                e_2 = _a.sent();
                console.log('Error authenticating purchase', e_2);
                res.status(402).send({ authenticated: false });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
module.exports = { checkout: checkout, authenticatePurchase: authenticatePurchase };
