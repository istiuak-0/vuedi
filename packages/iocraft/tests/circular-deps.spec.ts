import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  obtain, 
  obtainRaw, 
  obtainInstance, 
  obtainRawInstance,
  Register, 
  clearRegistry
} from './../src/core';



// Test Suite
describe('Circular Dependency Detection', () => {
  
  beforeEach(() => {
    clearRegistry();
    vi.restoreAllMocks();
  });

  // ==========================================================================
  // Test Group 1: Singleton with Facade (obtain)
  // ==========================================================================
  
  describe('obtain() - Singleton with Facade', () => {
    
    it('should detect and resolve circular dependency between two services', () => {
      @Register()
      class ServiceA {
        private serviceB = obtain(ServiceB);
        
        getValue() {
          return this.serviceB.getName();
        }
      }

      @Register()
      class ServiceB {
        private serviceA = obtain(ServiceA);
        
        getName() {
          return 'ServiceB';
        }
        
        getValueFromA() {
          return this.serviceA.getValue();
        }
      }

      // Should not throw
      const serviceA = obtain(ServiceA);
      
      // Should work via lazy proxy
      expect(serviceA.getValue()).toBe('ServiceB');
      
      // Get ServiceB and verify it can access ServiceA
      const serviceB = obtain(ServiceB);
      expect(serviceB.getValueFromA()).toBe('ServiceB');
    });

    it('should warn in dev mode about circular dependency', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      @Register()
      class ServiceA {
        private serviceB = obtain(ServiceB);
      }

      @Register()
      class ServiceB {
        private serviceA = obtain(ServiceA);
      }

      obtain(ServiceA);
      
      // Should have warned
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toContain('Circular dependency');
      
      consoleSpy.mockRestore();
    });

    it('should handle 3-way circular dependencies', () => {
      @Register()
      class ServiceA {
        private serviceB = obtain(ServiceB);
        
        getName() {
          return 'A';
        }
        
        getFromB() {
          return this.serviceB.getName();
        }
      }

      @Register()
      class ServiceB {
        private serviceC = obtain(ServiceC);
        
        getName() {
          return 'B';
        }
        
        getFromC() {
          return this.serviceC.getName();
        }
      }

      @Register()
      class ServiceC {
        private serviceA = obtain(ServiceA);
        
        getName() {
          return 'C';
        }
        
        getFromA() {
          return this.serviceA.getName();
        }
      }

      const serviceA = obtain(ServiceA);
      const serviceB = obtain(ServiceB);
      const serviceC = obtain(ServiceC);
      
      expect(serviceA.getFromB()).toBe('B');
      expect(serviceB.getFromC()).toBe('C');
      expect(serviceC.getFromA()).toBe('A');
    });

    it('should handle self-referencing service', () => {
      @Register()
      class ServiceA {
        private self = obtain(ServiceA);
        
        getSelf() {
          return this.self;
        }
      }

      const serviceA = obtain(ServiceA);
      
      // Self should resolve to the same facade
      expect(serviceA.getSelf()).toBe(serviceA);
    });

    it('should access properties through lazy proxy', () => {
      @Register()
      class ServiceA {
        public name = 'ServiceA';
        private serviceB = obtain(ServiceB);
        
        getNameFromB() {
          return this.serviceB.name;
        }
      }

      @Register()
      class ServiceB {
        public name = 'ServiceB';
        private serviceA = obtain(ServiceA);
        
        getNameFromA() {
          return this.serviceA.name;
        }
      }

      const serviceA = obtain(ServiceA);
      const serviceB = obtain(ServiceB);
      
      expect(serviceA.getNameFromB()).toBe('ServiceB');
      expect(serviceB.getNameFromA()).toBe('ServiceA');
    });

    it('should throw error if circular dependency accessed in constructor', () => {
      @Register()
      class ServiceA {
        constructor() {
          const serviceB = obtain(ServiceB);
          serviceB.getName(); // Too early!
        }
      }

      @Register()
      class ServiceB {
        private serviceA = obtain(ServiceA);
        
        getName() {
          return 'ServiceB';
        }
      }

      expect(() => {
        obtain(ServiceA);
      }).toThrow(/accessed before/);
    });
  });

  // ==========================================================================
  // Test Group 2: Singleton Raw (obtainRaw)
  // ==========================================================================
  
  describe('obtainRaw() - Singleton without Facade', () => {
    
    it('should detect and resolve circular dependency with raw instances', () => {
      @Register()
      class ServiceA {
        private serviceB = obtainRaw(ServiceB);
        
        getValue() {
          return this.serviceB.getName();
        }
      }

      @Register()
      class ServiceB {
        private serviceA = obtainRaw(ServiceA);
        
        getName() {
          return 'ServiceB';
        }
      }

      const serviceA = obtainRaw(ServiceA);
      
      expect(serviceA.getValue()).toBe('ServiceB');
    });

    it('should return same instance on multiple calls (singleton)', () => {
      @Register()
      class ServiceA {
        public id = Math.random();
      }

      const instance1 = obtainRaw(ServiceA);
      const instance2 = obtainRaw(ServiceA);
      
      expect(instance1).toBe(instance2);
      expect(instance1.id).toBe(instance2.id);
    });
  });

  // ==========================================================================
  // Test Group 3: Mixed Facade and Raw
  // ==========================================================================
  
  describe('Mixed obtain() and obtainRaw()', () => {
    
    it('should handle circular dependency with mixed facade and raw', () => {
      @Register()
      class ServiceA {
        private serviceB = obtain(ServiceB); // Facade
        
        getValue() {
          return this.serviceB.getName();
        }
      }

      @Register()
      class ServiceB {
        private serviceA = obtainRaw(ServiceA); // Raw
        
        getName() {
          return 'ServiceB';
        }
      }

      const serviceA = obtain(ServiceA);
      
      expect(serviceA.getValue()).toBe('ServiceB');
    });
  });

  // ==========================================================================
  // Test Group 4: Transient with Facade (obtainInstance)
  // ==========================================================================
  
  describe('obtainInstance() - Transient with Facade', () => {
    
    it('should detect circular dependency in transient instances', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      @Register()
      class ServiceA {
        private serviceB = obtainInstance(ServiceB);
        
        getValue() {
          return this.serviceB.getName();
        }
      }

      @Register()
      class ServiceB {
        private serviceA = obtainInstance(ServiceA);
        
        getName() {
          return 'ServiceB';
        }
      }

      // Should not cause infinite recursion
      const serviceA = obtainInstance(ServiceA);
      
      // Should warn about transient circular dependency
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toContain('transient');
      
      // Should still work via lazy proxy
      expect(serviceA.getValue()).toBe('ServiceB');
      
      consoleSpy.mockRestore();
    });

    it('should create different instances on each call (transient)', () => {
      @Register()
      class ServiceA {
        public id = Math.random();
      }

      const instance1 = obtainInstance(ServiceA);
      const instance2 = obtainInstance(ServiceA);
      
      // Different instances
      expect(instance1).not.toBe(instance2);
      expect(instance1.id).not.toBe(instance2.id);
    });

    it('should handle transient circular with methods', () => {
      @Register()
      class ServiceA {
        private serviceB = obtainInstance(ServiceB);
        
        doWork() {
          return this.serviceB.process();
        }
      }

      @Register()
      class ServiceB {
        private serviceA = obtainInstance(ServiceA);
        
        process() {
          return 'processed';
        }
      }

      const serviceA = obtainInstance(ServiceA);
      
      expect(serviceA.doWork()).toBe('processed');
    });
  });

  // ==========================================================================
  // Test Group 5: Transient Raw (obtainRawInstance)
  // ==========================================================================
  
  describe('obtainRawInstance() - Transient without Facade', () => {
    
    it('should detect circular dependency in raw transient instances', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      @Register()
      class ServiceA {
        private serviceB = obtainRawInstance(ServiceB);
        
        getValue() {
          return this.serviceB.getName();
        }
      }

      @Register()
      class ServiceB {
        private serviceA = obtainRawInstance(ServiceA);
        
        getName() {
          return 'ServiceB';
        }
      }

      const serviceA = obtainRawInstance(ServiceA);
      
      // Should warn
      expect(consoleSpy).toHaveBeenCalled();
      
      // Should work
      expect(serviceA.getValue()).toBe('ServiceB');
      
      consoleSpy.mockRestore();
    });

    it('should create different instances without facade', () => {
      @Register()
      class ServiceA {
        public id = Math.random();
      }

      const instance1 = obtainRawInstance(ServiceA);
      const instance2 = obtainRawInstance(ServiceA);
      
      expect(instance1).not.toBe(instance2);
      expect(instance1.id).not.toBe(instance2.id);
    });
  });

  // ==========================================================================
  // Test Group 6: Mixed Singleton and Transient
  // ==========================================================================
  
  describe('Mixed Singleton and Transient', () => {
    
    it('should handle singleton depending on transient', () => {
      @Register()
      class ServiceA {
        private serviceB = obtainInstance(ServiceB); // Transient
        
        getValue() {
          return this.serviceB.getName();
        }
      }

      @Register()
      class ServiceB {
        private serviceA = obtain(ServiceA); // Singleton - breaks cycle
        
        getName() {
          return 'ServiceB';
        }
      }

      const serviceA = obtain(ServiceA);
      
      expect(serviceA.getValue()).toBe('ServiceB');
    });

    it('should handle transient depending on singleton', () => {
      @Register()
      class ServiceA {
        private serviceB = obtain(ServiceB); // Singleton - breaks cycle
        
        getValue() {
          return this.serviceB.getName();
        }
      }

      @Register()
      class ServiceB {
        private serviceA = obtainInstance(ServiceA); // Transient
        
        getName() {
          return 'ServiceB';
        }
      }

      const serviceA = obtainInstance(ServiceA);
      
      expect(serviceA.getValue()).toBe('ServiceB');
    });
  });

  // ==========================================================================
  // Test Group 7: Complex Real-World Scenarios
  // ==========================================================================
  
  describe('Real-World Scenarios', () => {
    
    it('should handle user service <-> auth service pattern', () => {
      @Register()
      class AuthService {
        private userService = obtain(UserService);
        
        login(username: string) {
          const user = this.userService.findByUsername(username);
          return { token: 'abc123', user };
        }
      }

      @Register()
      class UserService {
        private authService = obtain(AuthService);
        
        findByUsername(username: string) {
          return { id: 1, username };
        }
        
        getCurrentUser() {
          // Might check auth in real scenario
          return this.findByUsername('current');
        }
      }

      const authService = obtain(AuthService);
      const result = authService.login('john');
      
      expect(result.user.username).toBe('john');
      expect(result.token).toBe('abc123');
    });

    it('should handle parent <-> child service pattern', () => {
      @Register()
      class ParentService {
        public name = 'Parent';
        private childService = obtain(ChildService);
        
        delegateToChild() {
          return this.childService.doWork();
        }
        
        getName() {
          return this.name;
        }
      }

      @Register()
      class ChildService {
        private parentService = obtain(ParentService);
        
        doWork() {
          return 'work done by ' + this.parentService.getName();
        }
      }

      const parent = obtain(ParentService);
      
      expect(parent.delegateToChild()).toBe('work done by Parent');
    });

    it('should handle deeply nested circular dependencies', () => {
      @Register()
      class ServiceA {
        private serviceB = obtain(ServiceB);
        getValue() { return this.serviceB.getValue() + 'A'; }
      }

      @Register()
      class ServiceB {
        private serviceC = obtain(ServiceC);
        getValue() { return this.serviceC.getValue() + 'B'; }
      }

      @Register()
      class ServiceC {
        private serviceD = obtain(ServiceD);
        getValue() { return this.serviceD.getValue() + 'C'; }
      }

      @Register()
      class ServiceD {
        private serviceA = obtain(ServiceA);
        getValue() { return 'D'; }
      }

      const serviceA = obtain(ServiceA);
      
      // This should resolve without infinite loop
      expect(serviceA.getValue()).toBe('DBCA');
    });
  });

  // ==========================================================================
  // Test Group 8: Edge Cases
  // ==========================================================================
  
  describe('Edge Cases', () => {
    
    it('should handle circular dependency with property setters', () => {
      @Register()
      class ServiceA {
        private serviceB = obtain(ServiceB);
        public value = 10;
        
        incrementB() {
          this.serviceB.value++;
        }
        
        getValueFromB() {
          return this.serviceB.value;
        }
      }

      @Register()
      class ServiceB {
        private serviceA = obtain(ServiceA);
        public value = 20;
        
        incrementA() {
          this.serviceA.value++;
        }
      }

      const serviceA = obtain(ServiceA);
      const serviceB = obtain(ServiceB);
      
      expect(serviceA.getValueFromB()).toBe(20);
      
      serviceA.incrementB();
      expect(serviceA.getValueFromB()).toBe(21);
      
      serviceB.incrementA();
      expect(serviceA.value).toBe(11);
    });

    it('should handle circular dependency with getters', () => {
      @Register()
      class ServiceA {
        private serviceB = obtain(ServiceB);
        private _value = 100;
        
        get value() {
          return this._value;
        }
        
        getValueFromB() {
          return this.serviceB.value;
        }
      }

      @Register()
      class ServiceB {
        private serviceA = obtain(ServiceA);
        private _value = 200;
        
        get value() {
          return this._value;
        }
      }

      const serviceA = obtain(ServiceA);
      
      expect(serviceA.getValueFromB()).toBe(200);
    });

    it('should handle multiple circular paths to same service', () => {
      @Register()
      class ServiceA {
        private serviceB = obtain(ServiceB);
        private serviceC = obtain(ServiceC);
        
        getFromB() {
          return this.serviceB.getName();
        }
        
        getFromC() {
          return this.serviceC.getName();
        }
      }

      @Register()
      class ServiceB {
        private serviceA = obtain(ServiceA);
        getName() { return 'B'; }
      }

      @Register()
      class ServiceC {
        private serviceA = obtain(ServiceA);
        getName() { return 'C'; }
      }

      const serviceA = obtain(ServiceA);
      
      expect(serviceA.getFromB()).toBe('B');
      expect(serviceA.getFromC()).toBe('C');
    });
  });

  // ==========================================================================
  // Test Group 9: Error Cases
  // ==========================================================================
  
  describe('Error Handling', () => {
    
    it('should provide helpful error message when accessed too early', () => {
      @Register()
      class ServiceA {
        constructor() {
          const serviceB = obtain(ServiceB);
          try {
            serviceB.getName(); // Too early!
          } catch (error: any) {
            expect(error.message).toContain('accessed before');
            expect(error.message).toContain('constructor');
            throw error;
          }
        }
      }

      @Register()
      class ServiceB {
        private serviceA = obtain(ServiceA);
        getName() { return 'B'; }
      }

      expect(() => {
        obtain(ServiceA);
      }).toThrow();
    });
  });

  // ==========================================================================
  // Test Group 10: Performance
  // ==========================================================================
  
  describe('Performance', () => {
    
    it('should not significantly slow down normal injection', () => {
      @Register()
      class ServiceA {
        getValue() { return 'A'; }
      }

      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        obtain(ServiceA);
      }
      
      const end = performance.now();
      const timePerCall = (end - start) / 1000;
      
      // Should be very fast (< 0.1ms per call after first)
      expect(timePerCall).toBeLessThan(0.1);
    });

    it('should handle circular dependency without performance degradation', () => {
      @Register()
      class ServiceA {
        private serviceB = obtain(ServiceB);
        getValue() { return this.serviceB.getName(); }
      }

      @Register()
      class ServiceB {
        private serviceA = obtain(ServiceA);
        getName() { return 'B'; }
      }

      const serviceA = obtain(ServiceA);
      
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        serviceA.getValue();
      }
      
      const end = performance.now();
      const timePerCall = (end - start) / 1000;
      
      // Lazy proxy access should be fast
      expect(timePerCall).toBeLessThan(0.01);
    });
  });
});