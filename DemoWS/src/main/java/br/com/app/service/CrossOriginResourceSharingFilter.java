/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.app.service;

import javax.ws.rs.ext.Provider;

/**
 *
 * @author Lucas
 */
@Provider
public class CrossOriginResourceSharingFilter implements javax.ws.rs.container.ContainerResponseFilter {

    @Override
    public void filter(javax.ws.rs.container.ContainerRequestContext requestContext, javax.ws.rs.container.ContainerResponseContext response) {
        response.getHeaders().putSingle("Access-Control-Allow-Origin", "*");
        response.getHeaders().putSingle("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
        response.getHeaders().putSingle("Access-Control-Allow-Headers", "Origin, X-Request-Width, Content-Type, Accept");
    }

}
