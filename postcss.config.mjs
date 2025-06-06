const config = {
  plugins: [
    "@tailwindcss/postcss",
    // NextJS 15: 성능 최적화 플러그인
    ...(process.env.NODE_ENV === "production"
      ? [
          // 프로덕션 빌드 시 CSS 최적화
          ["autoprefixer", {}],
          [
            "cssnano",
            {
              preset: [
                "default",
                {
                  discardComments: { removeAll: true },
                  normalizeWhitespace: true,
                  colormin: true,
                  convertValues: true,
                  discardEmpty: true,
                  discardDuplicates: true,
                  mergeRules: true,
                  minifyFontValues: true,
                  minifyGradients: true,
                  minifyParams: true,
                  minifySelectors: true,
                  reduceIdents: true,
                  reduceTransforms: true,
                  svgo: true,
                  uniqueSelectors: true,
                },
              ],
            },
          ],
        ]
      : []),
  ],
};

export default config;
