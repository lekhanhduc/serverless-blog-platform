package com.javabuilder.dto;

import lombok.*;
import java.util.Collections;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResponse<T> {
    private int size;
    private String nextToken;
    private boolean hasMore;

    @Builder.Default
    private List<T> result = Collections.emptyList();
}
