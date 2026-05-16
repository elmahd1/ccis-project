package com.ccis.SFE.security.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import com.ccis.SFE.entity.User;
import com.ccis.SFE.repository.UserRepository;
import com.ccis.SFE.security.CustomUserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    // in a production, we inject this from application.properties
    // must be at least 256 bits (32 characters) long for HS256
    private final String SECRET_KEY = "my_super_secret_key_which_must_be_very_long_and_secure";
    private final long JWT_EXPIRATION_MS = 86400000; // 24 hours
    
    @Autowired
    private UserRepository userRepository; 

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
    
public String generateToken(UserDetails userDetails) {
    Map<String, Object> claims = new HashMap<>();
    
    String role = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .findFirst()
            .orElse("ROLE_CLIENT");
    claims.put("role", role);
    
    // Try to get user ID from the CustomUserDetails
    Long userId = null;
    if (userDetails instanceof CustomUserDetails) {
        userId = ((CustomUserDetails) userDetails).getId();
    } else {
        // Fallback: fetch from database
        try {
            User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
            if (user != null) {
                userId = user.getId();
            }
        } catch (Exception e) {
            System.out.println("Could not fetch user ID: " + e.getMessage());
        }
    }
    
    if (userId != null) {
        claims.put("id", userId);
        claims.put("userId", userId);
    }
    
    return Jwts.builder()
            .setClaims(claims)
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_MS))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
}

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }
}