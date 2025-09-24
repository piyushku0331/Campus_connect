import { useEffect, useState } from 'react';

export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && !window.PERFORMANCE_MONITORING) {
      return;
    }

    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        setMetrics(prev => ({ ...prev, cls: metric.value }));
        console.log('CLS:', metric.value);
      });

      getFID((metric) => {
        setMetrics(prev => ({ ...prev, fid: metric.value }));
        console.log('FID:', metric.value);
      });

      getFCP((metric) => {
        setMetrics(prev => ({ ...prev, fcp: metric.value }));
        console.log('FCP:', metric.value);
      });

      getLCP((metric) => {
        setMetrics(prev => ({ ...prev, lcp: metric.value }));
        console.log('LCP:', metric.value);
      });

      getTTFB((metric) => {
        setMetrics(prev => ({ ...prev, ttfb: metric.value }));
        console.log('TTFB:', metric.value);
      });
    });

    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

      console.log('Page Load Time:', loadTime, 'ms');
      console.log('DOM Ready Time:', domReady, 'ms');
    }

    if (window.performance && window.performance.getEntriesByType) {
      const resources = window.performance.getEntriesByType('resource');
      const slowResources = resources.filter(resource =>
        resource.duration > 1000
      );

      if (slowResources.length > 0) {
        console.warn('Slow resources detected:', slowResources);
      }
    }

  }, []);

  return metrics;
};

export const withPerformanceMonitoring = (ComponentName) => (WrappedComponent) => {
  return (props) => {
    useEffect(() => {
      const startTime = performance.now();

      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;

        if (renderTime > 16.67) {
          console.warn(`${ComponentName} render time: ${renderTime.toFixed(2)}ms`);
        }
      };
    });

    return <WrappedComponent {...props} />;
  };
};

export const logBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle size monitoring active');
  }
};